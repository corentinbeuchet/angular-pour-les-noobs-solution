import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: `
    <label>
      Rechercher un titre
      <input type="search" (input)="onInput($event)" />
    </label>
  `,
})
export class SearchBar {
  /** Émis à chaque frappe, avec le texte saisi. */
  readonly search = output<string>();

  protected onInput(event: Event): void {
    this.search.emit((event.target as HTMLInputElement).value);
  }
}
