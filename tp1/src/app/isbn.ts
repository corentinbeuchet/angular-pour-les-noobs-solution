/**
 * Bonus du TP 1 : vérifier la clé de contrôle d'un ISBN-13.
 * Les 12 premiers chiffres sont pondérés alternativement par 1 et 3 ;
 * la clé est ce qu'il faut ajouter à la somme pour atteindre un multiple de 10.
 */
export function isValidIsbn13(isbn: string): boolean {
  if (!/^\d{13}$/.test(isbn)) {
    return false;
  }
  const digits = [...isbn].map(Number);
  const sum = digits
    .slice(0, 12)
    .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 1 : 3), 0);
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[12];
}
