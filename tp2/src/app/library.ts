import { Book } from './book';
import { BookNotFoundError, DuplicateBookError } from './errors';

export class Library {
  // Une Map indexée par ISBN : l'unicité et la recherche par ISBN sont gratuites.
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
}
