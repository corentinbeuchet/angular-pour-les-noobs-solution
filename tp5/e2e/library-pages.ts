import { Locator, Page } from '@playwright/test';

/**
 * Page Object : les tests parlent de « la liste », « le formulaire »,
 * pas de sélecteurs CSS. Si l'écran change, on ne corrige qu'ici.
 */
export class LibraryPages {
  constructor(private readonly page: Page) {}

  async openList(): Promise<void> {
    await this.page.goto('/livres');
  }

  bookItems(): Locator {
    return this.page.locator('app-book-list li span');
  }

  async search(text: string): Promise<void> {
    await this.page.getByLabel('Rechercher un titre').fill(text);
  }

  async sortBy(field: 'titre' | 'auteur' | 'ISBN'): Promise<void> {
    await this.page.getByLabel('Trier par').selectOption({ label: field });
  }

  async remove(title: string): Promise<void> {
    await this.page.getByRole('button', { name: `Supprimer ${title}` }).click();
  }

  async addBook(book: { isbn: string; title: string; author: string; year: number }): Promise<void> {
    await this.page.getByRole('link', { name: 'Ajouter un livre' }).click();
    await this.page.getByLabel('ISBN').fill(book.isbn);
    await this.page.getByLabel('Titre').fill(book.title);
    await this.page.getByLabel('Auteur').fill(book.author);
    await this.page.getByLabel('Année').fill(String(book.year));
    await this.page.getByRole('button', { name: 'Ajouter' }).click();
  }

  alert(): Locator {
    return this.page.getByRole('alert');
  }
}
