/**
 * Les critères de recherche : une « union discriminée ».
 * Le champ `kind` dit de quel critère il s'agit, et TypeScript en déduit les autres champs.
 * C'est l'équivalent TypeScript d'une `sealed interface` Java avec ses `record`.
 */
export type SearchCriteria =
  | { readonly kind: 'title'; readonly title: string }
  | { readonly kind: 'author'; readonly author: string }
  | { readonly kind: 'yearRange'; readonly from: number; readonly to: number };

export type SortField = 'title' | 'author' | 'isbn';
