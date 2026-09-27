import { Book } from './book';
import { BookNotFoundError, DuplicateBookError } from './errors';
import { SearchCriteria, SortField } from './search-criteria';

const byText = (a: string, b: string) => a.localeCompare(b, 'fr');

export class Library {
  private readonly books = new Map<string, Book>();

  addBook(book: Book): void {
    if (this.books.has(book.isbn)) {
      throw new DuplicateBookError(`ISBN déjà présent : ${book.isbn}`);
    }
    this.books.set(book.isbn, book);
  }

  removeBook(isbn: string): void {
    if (!this.books.delete(isbn)) {
      throw new BookNotFoundError(`Livre introuvable : ${isbn}`);
    }
  }

  getBooks(): readonly Book[] {
    return [...this.books.values()];
  }

  findByIsbn(isbn: string): Book {
    const book = this.books.get(isbn);
    if (!book) {
      throw new BookNotFoundError(`Livre introuvable : ${isbn}`);
    }
    return book;
  }

  findBookByTitle(title: string): Book {
    const book = this.getBooks().find((candidate) => candidate.title === title);
    if (!book) {
      throw new BookNotFoundError(`Livre introuvable : ${title}`);
    }
    return book;
  }

  findByAuthor(author: string): Book[] {
    return this.getBooks().filter((book) => book.author === author);
  }

  containsIsbn(isbn: string): boolean {
    return this.books.has(isbn);
  }

  size(): number {
    return this.books.size;
  }

  booksSortedBy(field: SortField): Book[] {
    return sortBooks(this.getBooks(), field);
  }

  search(criteria: SearchCriteria): Book[] {
    return searchBooks(this.getBooks(), criteria);
  }
}

/** On trie une copie (`[...books]`) : `sort` modifie le tableau sur place. */
export function sortBooks(books: readonly Book[], field: SortField): Book[] {
  switch (field) {
    case 'title':
      return [...books].sort((a, b) => byText(a.title, b.title));
    case 'author':
      return [...books].sort((a, b) => byText(a.author, b.author) || byText(a.title, b.title));
    case 'isbn':
      return [...books].sort((a, b) => byText(a.isbn, b.isbn));
  }
}

export function searchBooks(books: readonly Book[], criteria: SearchCriteria): Book[] {
  return books.filter((book) => {
    switch (criteria.kind) {
      case 'title':
        return book.title.toLowerCase().includes(criteria.title.toLowerCase());
      case 'author':
        return book.author.toLowerCase().includes(criteria.author.toLowerCase());
      case 'yearRange':
        return book.year >= criteria.from && book.year <= criteria.to;
      default: {
        // Si on ajoute un critère sans le traiter ici, cette ligne ne compile plus.
        const unhandled: never = criteria;
        return unhandled;
      }
    }
  });
}
