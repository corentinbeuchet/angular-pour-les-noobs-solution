import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createBook } from '../book';
import { BookApi, errorMessage } from '../book-api';

@Component({
  selector: 'app-book-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-form-page.html',
  styleUrl: './book-form-page.css',
})
export class BookFormPage {
  private readonly api = inject(BookApi);
  private readonly router = inject(Router);

  protected readonly error = signal<string | null>(null);

  protected readonly form = new FormGroup({
    isbn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{13}$/)],
    }),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1450), Validators.max(2100)],
    }),
  });

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }
    const { isbn, title, author, year } = this.form.getRawValue();
    this.api.addBook(createBook(isbn, title, author, year)).subscribe({
      next: () => this.router.navigateByUrl('/livres'),
      error: (error: unknown) => this.error.set(errorMessage(error)),
    });
  }
}
