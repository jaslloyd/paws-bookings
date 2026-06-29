// Pure, framework-agnostic helpers — no Vue imports, easy to unit test.
// Structurally typed so they work for any dated record (Booking, Reservation…).

/** Number of nights between a start and end date. */
export function nightsBetween(b: { start: string; end: string }): number {
  return (new Date(b.end).getTime() - new Date(b.start).getTime()) / 86_400_000;
}

/** Returns a new array sorted by start date (does not mutate the input). */
export function sortByStart<T extends { start: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.start.localeCompare(b.start));
}
