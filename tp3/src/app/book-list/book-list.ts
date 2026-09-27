import { Component, input } from '@angular/core';
import { Book, describeBook } from '../book';

@Component({
  selector: 'app-book-list',
  template: `
    <ul>
      @for (book of books(); track book.isbn) {
        <li>{{ describeBook(book) }}</li>
      } @empty {
        <li class="empty">Aucun livre ne correspond.</li>
      }
    </ul>
  `,
})
export class BookList {
  /** Les livres à afficher, fournis par le composant parent. */
  readonly books = input.required<readonly Book[]>();

  protected readonly describeBook = describeBook;
}
