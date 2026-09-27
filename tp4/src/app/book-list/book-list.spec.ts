import { TestBed } from '@angular/core/testing';
import { createBook } from '../book';
import { BookList } from './book-list';

describe('BookList', () => {
  it('affiche un élément par livre reçu en entrée', async () => {
    const fixture = TestBed.createComponent(BookList);
    fixture.componentRef.setInput('books', [
      createBook('9780132350884', 'Clean Code', 'Robert C. Martin', 2008),
      createBook('9780134685991', 'Effective Java', 'Joshua Bloch', 2018),
    ]);
    await fixture.whenStable();

    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[1].textContent).toContain('Effective Java');
  });

  it('affiche un message quand la liste est vide', async () => {
    const fixture = TestBed.createComponent(BookList);
    fixture.componentRef.setInput('books', []);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.empty')?.textContent).toContain('Aucun livre');
  });
});
