import { createBook, describeBook } from './book';

describe('createBook', () => {
  it('crée un livre avec ses quatre champs', () => {
    const book = createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008);

    expect(book).toEqual({
      isbn: '9780132350884',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      year: 2008,
    });
  });

  it.each(['', '   '])('refuse l\'ISBN "%s"', (isbn) => {
    expect(() => createBook(isbn, 'Clean Code', 'Robert C. Martin', 2008)).toThrow('ISBN invalide');
  });

  it.each(['', '   '])('refuse le titre "%s"', (title) => {
    expect(() => createBook('9780132350884', title, 'Robert C. Martin', 2008)).toThrow(
      'Titre invalide',
    );
  });
});

describe('describeBook', () => {
  it('décrit un livre sur une ligne', () => {
    const book = createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008);

    expect(describeBook(book)).toBe('Clean Code - Robert C. Martin (2008)');
  });
});
