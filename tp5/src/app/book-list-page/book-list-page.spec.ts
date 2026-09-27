import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Book, createBook } from '../book';
import { BookApi } from '../book-api';
import { BookListPage } from './book-list-page';

const CLEAN_CODE = createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008);
const EFFECTIVE_JAVA = createBook('9780134685991', 'Effective Java', 'Joshua Bloch', 2018);

describe('BookListPage', () => {
  // Un faux BookApi : pas de HTTP, on contrôle ce que « l'API » répond.
  const api = {
    getBooks: vi.fn(),
    deleteBook: vi.fn(),
  };
  let fixture: ComponentFixture<BookListPage>;
  let page: HTMLElement;

  async function render(books: Book[] = [CLEAN_CODE, EFFECTIVE_JAVA]) {
    api.getBooks.mockReturnValue(of(books));
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: BookApi, useValue: api }],
    });
    fixture = TestBed.createComponent(BookListPage);
    page = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  const titles = () =>
    [...page.querySelectorAll('app-book-list li span')].map((item) => item.textContent?.trim());

  beforeEach(() => vi.resetAllMocks());

  it('affiche les livres renvoyés par l\'API, triés par titre', async () => {
    await render();

    expect(api.getBooks).toHaveBeenCalledWith('title');
    expect(titles()).toEqual([
      'Clean Code - Robert C. Martin (2008)',
      'Effective Java - Joshua Bloch (2018)',
    ]);
  });

  it('redemande les livres quand on change le tri', async () => {
    await render();

    const select = page.querySelector('select') as HTMLSelectElement;
    select.value = 'author';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(api.getBooks).toHaveBeenLastCalledWith('author');
  });

  it('filtre pendant la saisie, sans rappeler l\'API', async () => {
    await render();

    const input = page.querySelector('app-search-bar input') as HTMLInputElement;
    input.value = 'java';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(titles()).toEqual(['Effective Java - Joshua Bloch (2018)']);
    expect(api.getBooks).toHaveBeenCalledTimes(1);
  });

  it('supprime un livre puis recharge la liste', async () => {
    await render();
    api.deleteBook.mockReturnValue(of(undefined));
    api.getBooks.mockReturnValue(of([EFFECTIVE_JAVA]));

    (page.querySelector('button[aria-label="Supprimer Clean Code"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(api.deleteBook).toHaveBeenCalledWith('9780132350884');
    expect(titles()).toEqual(['Effective Java - Joshua Bloch (2018)']);
  });

  it('affiche un message si l\'API ne répond pas', async () => {
    api.getBooks.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: BookApi, useValue: api }],
    });
    fixture = TestBed.createComponent(BookListPage);
    await fixture.whenStable();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('L\'API ne répond pas');
  });
});
