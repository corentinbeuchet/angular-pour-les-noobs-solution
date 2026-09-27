import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';
import { SortField } from './search-criteria';

/**
 * Accès à l'API REST de java-pour-les-noobs (TP 4 / TP 5 Java).
 * Les URL sont relatives : en développement, `ng serve` les transmet à http://localhost:8080
 * grâce à proxy.conf.json (pas de problème de CORS).
 */
@Injectable({ providedIn: 'root' })
export class BookApi {
  private readonly http = inject(HttpClient);

  getBooks(sort: SortField): Observable<Book[]> {
    return this.http.get<Book[]>('/books', { params: { sort } });
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>('/books', book);
  }

  deleteBook(isbn: string): Observable<void> {
    return this.http.delete<void>(`/books/${isbn}`);
  }
}

/** Transforme une erreur HTTP en message lisible (le champ `detail` du ProblemDetail Spring). */
export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const detail: unknown = error.error?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    // 0 : aucune réponse ; 502/504 : le proxy de ng serve n'a pas pu joindre l'API
    if (error.status === 0 || error.status === 502 || error.status === 504) {
      return 'L\'API ne répond pas : est-elle démarrée sur le port 8080 ?';
    }
    return `Erreur ${error.status}`;
  }
  return 'Erreur inattendue';
}
