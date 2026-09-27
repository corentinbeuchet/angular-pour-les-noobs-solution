import { Component, computed, signal } from '@angular/core';
import { createBook } from './book';
import { BookList } from './book-list/book-list';
import { Library, searchBooks, sortBooks } from './library';
import { SearchBar } from './search-bar/search-bar';
import { SortField } from './search-criteria';

@Component({
  selector: 'app-root',
  imports: [BookList, SearchBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly library = new Library();

  protected readonly query = signal('');
  protected readonly sort = signal<SortField>('title');

  /** Recalculé automatiquement dès que `query` ou `sort` change. */
  protected readonly visibleBooks = computed(() =>
    sortBooks(searchBooks(this.library.getBooks(), { kind: 'title', title: this.query() }), this.sort()),
  );

  constructor() {
    this.library.addBook(createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008));
    this.library.addBook(createBook('9780134685991', 'Effective Java', 'Joshua Bloch', 2018));
    this.library.addBook(
      createBook('9780201485677', 'Refactoring', 'Martin Fowler', 1999),
    );
  }

  protected onSortChange(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortField);
  }
}
