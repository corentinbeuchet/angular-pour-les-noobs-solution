import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('affiche le titre', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('h1')?.textContent).toContain('Ma bibliothèque');
  });

  it('affiche un élément de liste par livre', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Clean Code - Robert C. Martin (2008)');
  });
});
