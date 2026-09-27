import { expect, test } from '@playwright/test';
import { LibraryPages } from './library-pages';

/**
 * Tests de bout en bout sur la VRAIE API (java-pour-les-noobs, TP 5, profil dev) :
 *   1. démarrez PostgreSQL et l'API Spring Boot sur le port 8080 ;
 *   2. npm run e2e:fullstack
 * Ils ne tournent pas dans la CI (pas d'API là-bas) : voir le projet « fullstack » de playwright.config.ts.
 */
test.describe('avec l\'API Spring Boot @fullstack', () => {
  test('affiche les livres d\'exemple de la base', async ({ page }) => {
    const library = new LibraryPages(page);
    await library.openList();

    await expect(library.bookItems()).toContainText(['Clean Code - Robert C. Martin (2008)']);
  });

  test('ajoute puis supprime un livre, pour de vrai', async ({ page }) => {
    const library = new LibraryPages(page);
    // Un ISBN (13 chiffres) différent à chaque exécution : la base garde les données entre deux lancements.
    const isbn = `979${Date.now()}`.slice(0, 13);
    const book = { isbn, title: `Livre e2e ${isbn}`, author: 'Playwright', year: 2026 };

    await library.openList();
    await library.addBook(book);
    await expect(library.bookItems()).toContainText([`Livre e2e ${isbn} - Playwright (2026)`]);

    await library.remove(book.title);
    await expect(library.bookItems()).not.toContainText([`Livre e2e ${isbn} - Playwright (2026)`]);
  });
});
