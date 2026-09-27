import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { createBook } from '../book';
import { BookApi } from '../book-api';
import { BookFormPage } from './book-form-page';

describe('BookFormPage', () => {
  const api = { addBook: vi.fn() };
  let fixture: ComponentFixture<BookFormPage>;
  let page: HTMLElement;
  let router: Router;

  beforeEach(async () => {
    vi.resetAllMocks();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: BookApi, useValue: api }],
    });
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(BookFormPage);
    page = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  async function fill(values: Record<string, string>) {
    for (const [name, value] of Object.entries(values)) {
      const input = page.querySelector(`input[formControlName="${name}"]`) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    await fixture.whenStable();
  }

  async function submit() {
    page.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  }

  const submitButton = () => page.querySelector('button[type="submit"]') as HTMLButtonElement;

  const VALID = {
    isbn: '9780132350884',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: '2008',
  };

  it('désactive le bouton tant que le formulaire est incomplet', () => {
    expect(submitButton().disabled).toBe(true);
  });

  it.each(['978013235088', '978-0132350884', 'abcdefghijklm'])(
    'refuse l\'ISBN "%s"',
    async (isbn) => {
      await fill({ ...VALID, isbn });

      expect(submitButton().disabled).toBe(true);
    },
  );

  it('envoie le livre à l\'API puis revient à la liste', async () => {
    api.addBook.mockReturnValue(of(undefined));
    await fill(VALID);

    expect(submitButton().disabled).toBe(false);
    await submit();

    expect(api.addBook).toHaveBeenCalledWith(
      createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008),
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/livres');
  });

  it('affiche le motif quand l\'ISBN existe déjà (409)', async () => {
    api.addBook.mockReturnValue(
      throwError(
        () => new HttpErrorResponse({ status: 409, error: { detail: 'ISBN déjà présent : 9780132350884' } }),
      ),
    );
    await fill(VALID);
    await submit();

    expect(page.querySelector('[role="alert"]')?.textContent).toContain('ISBN déjà présent');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
