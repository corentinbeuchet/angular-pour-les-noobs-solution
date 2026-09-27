import { createBook } from './book';
import { BookNotFoundError, DuplicateBookError, LibraryError } from './errors';
import { Library } from './library';

const CLEAN_CODE = createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008);
const CLEAN_ARCHITECTURE = createBook('9780134494166', 'Clean Architecture', 'Robert C. Martin', 2017);
const EFFECTIVE_JAVA = createBook('9780134685991', 'Effective Java', 'Joshua Bloch', 2018);

describe('Library', () => {
  let library: Library;

  beforeEach(() => {
    library = new Library();
  });

  it('trouve un livre par son titre', () => {
    library.addBook(CLEAN_CODE);

    const book = library.findBookByTitle('Clean Code');

    expect(book?.isbn).toBe('9780132350884');
  });

  describe('quand elle est vide', () => {
    it('ne contient aucun livre', () => {
      expect(library.size()).toBe(0);
      expect(library.getBooks()).toEqual([]);
    });

    it('lève BookNotFoundError si on cherche un ISBN', () => {
      expect(() => library.findByIsbn(CLEAN_CODE.isbn)).toThrow(BookNotFoundError);
    });

    it('lève BookNotFoundError si on supprime un livre', () => {
      expect(() => library.removeBook(CLEAN_CODE.isbn)).toThrow(BookNotFoundError);
    });

    it('lève BookNotFoundError si on cherche un titre', () => {
      expect(() => library.findBookByTitle('Clean Code')).toThrow(BookNotFoundError);
    });
  });

  describe('avec des livres', () => {
    beforeEach(() => {
      library.addBook(CLEAN_CODE);
      library.addBook(CLEAN_ARCHITECTURE);
      library.addBook(EFFECTIVE_JAVA);
    });

    it('compte les livres', () => {
      expect(library.size()).toBe(3);
    });

    it('trouve un livre par son ISBN', () => {
      expect(library.findByIsbn('9780134685991')).toBe(EFFECTIVE_JAVA);
    });

    it('trouve tous les livres d\'un auteur', () => {
      expect(library.findByAuthor('Robert C. Martin')).toEqual([CLEAN_CODE, CLEAN_ARCHITECTURE]);
    });

    it('renvoie une liste vide pour un auteur inconnu', () => {
      expect(library.findByAuthor('Inconnu')).toEqual([]);
    });

    it('sait si un ISBN est présent', () => {
      expect(library.containsIsbn(CLEAN_CODE.isbn)).toBe(true);
      expect(library.containsIsbn('9780000000000')).toBe(false);
    });

    it('supprime un livre', () => {
      library.removeBook(CLEAN_CODE.isbn);

      expect(library.size()).toBe(2);
      expect(library.containsIsbn(CLEAN_CODE.isbn)).toBe(false);
    });

    it('refuse un second livre avec le même ISBN', () => {
      const copy = createBook(CLEAN_CODE.isbn, 'Autre titre', 'Autre auteur', 2020);

      expect(() => library.addBook(copy)).toThrow(DuplicateBookError);
      expect(library.size()).toBe(3);
    });

    it('explique quel ISBN est en double', () => {
      expect(() => library.addBook(CLEAN_CODE)).toThrow(`ISBN déjà présent : ${CLEAN_CODE.isbn}`);
    });

    it('ne laisse pas modifier sa liste de l\'extérieur', () => {
      const books = library.getBooks() as unknown[];
      books.length = 0;

      expect(library.size()).toBe(3);
    });
  });

  it('range ses erreurs sous LibraryError', () => {
    expect(() => library.findByIsbn('9780000000000')).toThrow(LibraryError);
  });
});
