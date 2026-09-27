import { Page, Route } from '@playwright/test';

export interface ApiBook {
  isbn: string;
  title: string;
  author: string;
  year: number;
}

/** L'URL de l'API seulement : /books, /books?sort=…, /books/{isbn} (pas la page /livres). */
const API = /\/books(\/[^/?]+)?(\?.*)?$/;

/**
 * Une fausse API REST en mémoire, branchée sur le navigateur avec page.route.
 * Elle reproduit les réponses de java-pour-les-noobs : 200, 201, 204, 404, 409 + ProblemDetail.
 */
export class FakeBookApi {
  readonly requests: { method: string; url: string; body: unknown }[] = [];

  constructor(private books: ApiBook[]) {}

  async install(page: Page): Promise<void> {
    await page.route(API, (route) => this.handle(route));
  }

  private async handle(route: Route): Promise<void> {
    const request = route.request();
    const url = new URL(request.url());
    const body = request.postDataJSON() as unknown;
    this.requests.push({ method: request.method(), url: url.pathname + url.search, body });

    if (request.method() === 'GET') {
      const sort = (url.searchParams.get('sort') ?? 'title') as keyof ApiBook;
      const sorted = [...this.books].sort((a, b) => String(a[sort]).localeCompare(String(b[sort])));
      return route.fulfill({ json: sorted });
    }

    if (request.method() === 'POST') {
      const book = body as ApiBook;
      if (this.books.some((existing) => existing.isbn === book.isbn)) {
        return route.fulfill({
          status: 409,
          json: { status: 409, detail: `ISBN déjà présent : ${book.isbn}` },
        });
      }
      this.books.push(book);
      return route.fulfill({ status: 201, json: book });
    }

    if (request.method() === 'DELETE') {
      const isbn = url.pathname.split('/').pop();
      if (!this.books.some((book) => book.isbn === isbn)) {
        return route.fulfill({ status: 404, json: { status: 404, detail: `Livre introuvable : ${isbn}` } });
      }
      this.books = this.books.filter((book) => book.isbn !== isbn);
      return route.fulfill({ status: 204 });
    }

    return route.fulfill({ status: 405 });
  }
}
