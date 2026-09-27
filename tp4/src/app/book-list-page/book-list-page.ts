import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../book';
import { BookApi, errorMessage } from '../book-api';
import { BookList } from '../book-list/book-list';
import { searchBooks } from '../library';
import { SearchBar } from '../search-bar/search-bar';
import { SortField } from '../search-criteria';

@Component({
  selector: 'app-book-list-page',
  imports: [BookList, SearchBar, RouterLink],
  templateUrl: './book-list-page.html',
})
export class BookListPage {
  private readonly api = inject(BookApi);

  protected readonly books = signal<readonly Book[]>([]);
  protected readonly query = signal('');
  protected readonly sort = signal<SortField>('title');
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly visibleBooks = computed(() =>
    searchBooks(this.books(), { kind: 'title', title: this.query() }),
  );

  constructor() {
    this.load();
  }

  protected onSortChange(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortField);
    this.load();
  }

  protected remove(book: Book): void {
    this.api.deleteBook(book.isbn).subscribe({
      next: () => this.load(),
      error: (error: unknown) => this.error.set(errorMessage(error)),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api.getBooks(this.sort()).subscribe({
      next: (books) => {
        this.books.set(books);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
