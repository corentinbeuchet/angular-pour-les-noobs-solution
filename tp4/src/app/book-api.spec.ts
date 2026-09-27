import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Book, createBook } from './book';
import { BookApi, errorMessage } from './book-api';

const CLEAN_CODE = createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008);

describe('BookApi', () => {
  let api: BookApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(BookApi);
    http = TestBed.inject(HttpTestingController);
  });

  // Échoue si une requête attendue n'a pas été envoyée, ou si une requête inattendue l'a été.
  afterEach(() => http.verify());

  it('demande les livres triés par le champ choisi', () => {
    let received: Book[] = [];
    api.getBooks('author').subscribe((books) => (received = books));

    const request = http.expectOne('/books?sort=author');
    expect(request.request.method).toBe('GET');
    request.flush([CLEAN_CODE]);

    expect(received).toEqual([CLEAN_CODE]);
  });

  it('envoie le nouveau livre en JSON', () => {
    api.addBook(CLEAN_CODE).subscribe();

    const request = http.expectOne('/books');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(CLEAN_CODE);
    request.flush(CLEAN_CODE, { status: 201, statusText: 'Created' });
  });

  it('supprime un livre par son ISBN', () => {
    api.deleteBook('9780132350884').subscribe();

    const request = http.expectOne('/books/9780132350884');
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('transmet l\'erreur 409 de l\'API', () => {
    let failure: unknown;
    api.addBook(CLEAN_CODE).subscribe({ error: (error: unknown) => (failure = error) });

    http
      .expectOne('/books')
      .flush({ detail: 'ISBN déjà présent : 9780132350884' }, { status: 409, statusText: 'Conflict' });

    expect(errorMessage(failure)).toBe('ISBN déjà présent : 9780132350884');
  });
});

describe('errorMessage', () => {
  it('utilise le champ detail du ProblemDetail', () => {
    const error = new HttpErrorResponse({ status: 404, error: { detail: 'Livre introuvable' } });

    expect(errorMessage(error)).toBe('Livre introuvable');
  });

  it('explique quand l\'API ne répond pas', () => {
    expect(errorMessage(new HttpErrorResponse({ status: 0 }))).toContain('port 8080');
  });

  it('donne le code HTTP à défaut de détail', () => {
    expect(errorMessage(new HttpErrorResponse({ status: 500 }))).toBe('Erreur 500');
  });

  it('reste lisible pour une erreur qui ne vient pas de HTTP', () => {
    expect(errorMessage(new Error('boum'))).toBe('Erreur inattendue');
  });
});
