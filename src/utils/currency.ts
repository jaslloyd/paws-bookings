const eur = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

/** Format a number of euros, e.g. 106 → "€106.00". */
export function formatEuro(amount: number): string {
  return eur.format(amount);
}
