import { createBook } from './book';
import { Library } from './library';
import { SearchCriteria } from './search-criteria';

const CLEAN_CODE = createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008);
const CLEAN_ARCHITECTURE = createBook('9780134494166', 'Clean Architecture', 'Robert C. Martin', 2017);
const EFFECTIVE_JAVA = createBook('9780134685991', 'Effective Java', 'Joshua Bloch', 2018);
const REFACTORING = createBook('9780201485677', 'Refactoring', 'Martin Fowler', 1999);

describe('Library : tri et recherche', () => {
  let library: Library;

  beforeEach(() => {
    library = new Library();
    [EFFECTIVE_JAVA, CLEAN_CODE, REFACTORING, CLEAN_ARCHITECTURE].forEach((book) =>
      library.addBook(book),
    );
  });

  describe('tri', () => {
    it('par titre', () => {
      expect(library.booksSortedBy('title').map((book) => book.title)).toEqual([
        'Clean Architecture',
        'Clean Code',
        'Effective Java',
        'Refactoring',
      ]);
    });

    it('par auteur, puis par titre', () => {
      expect(library.booksSortedBy('author')).toEqual([
        EFFECTIVE_JAVA,
        REFACTORING,
        CLEAN_ARCHITECTURE,
        CLEAN_CODE,
      ]);
    });

    it('par ISBN', () => {
      expect(library.booksSortedBy('isbn').map((book) => book.isbn)).toEqual([
        '9780132350884',
        '9780134494166',
        '9780134685991',
        '9780201485677',
      ]);
    });

    it('d\'une bibliothèque vide', () => {
      expect(new Library().booksSortedBy('title')).toEqual([]);
    });

    it('ne modifie pas l\'ordre d\'insertion', () => {
      library.booksSortedBy('title');

      expect(library.getBooks()[0]).toBe(EFFECTIVE_JAVA);
    });
  });

  describe('recherche', () => {
    it.each<{ criteria: SearchCriteria; expected: string[] }>([
      { criteria: { kind: 'title', title: 'clean' }, expected: ['Clean Code', 'Clean Architecture'] },
      { criteria: { kind: 'author', author: 'FOWLER' }, expected: ['Refactoring'] },
      { criteria: { kind: 'yearRange', from: 2000, to: 2017 }, expected: ['Clean Code', 'Clean Architecture'] },
      { criteria: { kind: 'title', title: 'inconnu' }, expected: [] },
    ])('$criteria.kind : $expected', ({ criteria, expected }) => {
      const titles = library.search(criteria).map((book) => book.title);

      expect(titles).toEqual(expect.arrayContaining(expected));
      expect(titles).toHaveLength(expected.length);
    });

    it('inclut les bornes de l\'intervalle d\'années', () => {
      expect(library.search({ kind: 'yearRange', from: 2008, to: 2008 })).toEqual([CLEAN_CODE]);
    });
  });
});
