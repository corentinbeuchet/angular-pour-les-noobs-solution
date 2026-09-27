import { Component, input, output } from '@angular/core';
import { Book, describeBook } from '../book';

@Component({
  selector: 'app-book-list',
  template: `
    <ul>
      @for (book of books(); track book.isbn) {
        <li>
          <span>{{ describeBook(book) }}</span>
          <button type="button" (click)="remove.emit(book)" [attr.aria-label]="'Supprimer ' + book.title">
            Supprimer
          </button>
        </li>
      } @empty {
        <li class="empty">Aucun livre ne correspond.</li>
      }
    </ul>
  `,
  styles: `
    li {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.35rem 0;
      border-bottom: 1px solid var(--border);
    }
  `,
})
export class BookList {
  readonly books = input.required<readonly Book[]>();

  /** Émis quand l'utilisateur clique sur « Supprimer ». */
  readonly remove = output<Book>();

  protected readonly describeBook = describeBook;
}
