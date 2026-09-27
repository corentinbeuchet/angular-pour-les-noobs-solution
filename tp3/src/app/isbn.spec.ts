import { isValidIsbn13 } from './isbn';

describe('isValidIsbn13', () => {
  it.each([
    '9780132350884', // Clean Code
    '9780134685991', // Effective Java
    '9780201485677', // Refactoring
  ])('accepte %s', (isbn) => {
    expect(isValidIsbn13(isbn)).toBe(true);
  });

  it.each([
    { isbn: '9780132350885', reason: 'mauvaise clé' },
    { isbn: '978013235088', reason: '12 chiffres' },
    { isbn: '978-0132350884', reason: 'tiret' },
    { isbn: '97801323508AB', reason: 'lettres' },
    { isbn: '', reason: 'vide' },
  ])('refuse $isbn ($reason)', ({ isbn }) => {
    expect(isValidIsbn13(isbn)).toBe(false);
  });
});
