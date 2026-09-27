import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let page: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(App);
    page = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  const titles = () =>
    [...page.querySelectorAll('app-book-list li')].map((item) => item.textContent?.trim());

  async function type(text: string) {
    const input = page.querySelector('app-search-bar input') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('affiche tous les livres, triés par titre', () => {
    expect(titles()).toEqual([
      'Clean Code - Robert C. Martin (2008)',
      'Effective Java - Joshua Bloch (2018)',
      'Refactoring - Martin Fowler (1999)',
    ]);
  });

  it('filtre les livres pendant la saisie', async () => {
    await type('java');

    expect(titles()).toEqual(['Effective Java - Joshua Bloch (2018)']);
    expect(page.querySelector('.count')?.textContent).toContain('1 résultat(s)');
  });

  it('affiche un message quand rien ne correspond', async () => {
    await type('cobol');

    expect(titles()).toEqual(['Aucun livre ne correspond.']);
  });

  it('change l\'ordre quand on trie par auteur', async () => {
    const select = page.querySelector('select') as HTMLSelectElement;
    select.value = 'author';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(titles()[0]).toContain('Effective Java');
  });
});
