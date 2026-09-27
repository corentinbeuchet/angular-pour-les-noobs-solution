/**
 * Hiérarchie d'erreurs métier.
 * `name` rend le type lisible dans la console et dans les messages de test.
 */
export class LibraryError extends Error {
  override readonly name: string = 'LibraryError';
}

export class BookNotFoundError extends LibraryError {
  override readonly name = 'BookNotFoundError';
}

export class DuplicateBookError extends LibraryError {
  override readonly name = 'DuplicateBookError';
}
