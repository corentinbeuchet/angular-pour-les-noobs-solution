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
  /**
   * Émis à chaque frappe, avec le texte saisi.
   * (Pas « search » : c'est déjà un événement natif des <input type="search">.)
   */
  readonly queryChange = output<string>();

  protected onInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }
}
