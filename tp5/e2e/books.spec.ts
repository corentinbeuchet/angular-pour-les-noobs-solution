import { expect, test } from '@playwright/test';
import { ApiBook, FakeBookApi } from './fake-book-api';
import { LibraryPages } from './library-pages';

const CLEAN_CODE: ApiBook = { isbn: '9780132350884', title: 'Clean Code', author: 'Robert C. Martin', year: 2008 };
const EFFECTIVE_JAVA: ApiBook = { isbn: '9780134685991', title: 'Effective Java', author: 'Joshua Bloch', year: 2018 };
const REFACTORING: ApiBook = { isbn: '9780201485677', title: 'Refactoring', author: 'Martin Fowler', year: 1999 };

let api: FakeBookApi;
let library: LibraryPages;

test.beforeEach(async ({ page }) => {
  api = new FakeBookApi([EFFECTIVE_JAVA, REFACTORING, CLEAN_CODE]);
  await api.install(page);
  library = new LibraryPages(page);
  await library.openList();
});

test('affiche les livres de l\'API, triés par titre', async () => {
  await expect(library.bookItems()).toHaveText([
    'Clean Code - Robert C. Martin (2008)',
    'Effective Java - Joshua Bloch (2018)',
    'Refactoring - Martin Fowler (1999)',
  ]);
  expect(api.requests[0]).toMatchObject({ method: 'GET', url: '/books?sort=title' });
});

test('trie par auteur en redemandant la liste à l\'API', async () => {
  await library.sortBy('auteur');

  await expect(library.bookItems().first()).toHaveText('Effective Java - Joshua Bloch (2018)');
  expect(api.requests.at(-1)).toMatchObject({ method: 'GET', url: '/books?sort=author' });
});

test('filtre pendant la saisie', async () => {
  await library.search('java');

  await expect(library.bookItems()).toHaveText(['Effective Java - Joshua Bloch (2018)']);
});

test('ajoute un livre puis revient à la liste', async ({ page }) => {
  const book = { isbn: '9780134494166', title: 'Clean Architecture', author: 'Robert C. Martin', year: 2017 };

  await library.addBook(book);

  await expect(page).toHaveURL(/\/livres$/);
  await expect(library.bookItems()).toContainText(['Clean Architecture - Robert C. Martin (2017)']);
  expect(api.requests.find((request) => request.method === 'POST')?.body).toEqual(book);
});

test('affiche le motif de l\'API quand l\'ISBN existe déjà', async ({ page }) => {
  await library.addBook({ ...CLEAN_CODE, title: 'Doublon' });

  await expect(library.alert()).toHaveText('ISBN déjà présent : 9780132350884');
  await expect(page).toHaveURL(/\/livres\/ajouter$/);
});

test('supprime un livre', async () => {
  await library.remove('Refactoring');

  await expect(library.bookItems()).toHaveCount(2);
  await expect(library.bookItems()).not.toContainText(['Refactoring - Martin Fowler (1999)']);
});

test('prévient quand l\'API ne répond pas', async ({ page }) => {
  // API arrêtée : le proxy de ng serve répond 502 (Bad Gateway), sans ProblemDetail
  await page.unrouteAll();
  await page.route(/\/books(\?.*)?$/, (route) => route.fulfill({ status: 502, body: '' }));

  await library.openList();

  await expect(library.alert()).toContainText('L\'API ne répond pas');
});
