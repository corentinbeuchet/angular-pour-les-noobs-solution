/**
 * Un livre de la bibliothèque.
 * `readonly` : une fois créé, un livre ne change plus (l'ISBN surtout).
 */
export interface Book {
  readonly isbn: string;
  readonly title: string;
  readonly author: string;
  readonly year: number;
}

export function createBook(isbn: string, title: string, author: string, year: number): Book {
  if (isBlank(isbn)) {
    throw new Error('ISBN invalide');
  }
  if (isBlank(title)) {
    throw new Error('Titre invalide');
  }
  return { isbn, title, author, year };
}

export function describeBook(book: Book): string {
  return `${book.title} - ${book.author} (${book.year})`;
}

function isBlank(value: string | null | undefined): boolean {
  return value == null || value.trim() === '';
}
