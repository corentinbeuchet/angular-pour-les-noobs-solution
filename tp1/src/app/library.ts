import { Book } from './book';

export class Library {
  private readonly books: Book[] = [];

  addBook(book: Book): void {
    if (this.containsIsbn(book.isbn)) {
      throw new Error(`ISBN déjà présent : ${book.isbn}`);
    }
    this.books.push(book);
  }

  removeBook(isbn: string): void {
    const index = this.books.findIndex((book) => book.isbn === isbn);
    if (index >= 0) {
      this.books.splice(index, 1);
    }
  }

  getBooks(): readonly Book[] {
    return [...this.books];
  }

  findByIsbn(isbn: string): Book | undefined {
    return this.books.find((book) => book.isbn === isbn);
  }

  findBookByTitle(title: string): Book | undefined {
    return this.books.find((book) => book.title === title);
  }

  findByAuthor(author: string): Book[] {
    return this.books.filter((book) => book.author === author);
  }

  containsIsbn(isbn: string): boolean {
    return this.books.some((book) => book.isbn === isbn);
  }

  size(): number {
    return this.books.length;
  }
}
