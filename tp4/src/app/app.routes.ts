import { Routes } from '@angular/router';
import { BookFormPage } from './book-form-page/book-form-page';
import { BookListPage } from './book-list-page/book-list-page';

/**
 * Les routes de l'interface sont en français (/livres) et l'API en anglais (/books) :
 * sinon, un rafraîchissement de /books serait envoyé à l'API par le proxy.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'livres', pathMatch: 'full' },
  { path: 'livres', component: BookListPage, title: 'Livres' },
  { path: 'livres/ajouter', component: BookFormPage, title: 'Ajouter un livre' },
  { path: '**', redirectTo: 'livres' },
];
