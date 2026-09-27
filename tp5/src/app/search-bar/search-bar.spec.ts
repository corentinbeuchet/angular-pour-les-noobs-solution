import { TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  it('émet le texte saisi', async () => {
    const fixture = TestBed.createComponent(SearchBar);
    const emitted: string[] = [];
    fixture.componentInstance.queryChange.subscribe((text) => emitted.push(text));
    await fixture.whenStable();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
    input.value = 'clean';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toEqual(['clean']);
  });
});
