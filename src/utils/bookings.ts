import type { Booking } from "@/types";

// Pure, framework-agnostic helpers — no Vue imports, easy to unit test.

/** Number of nights between a booking's start and end dates. */
export function nightsBetween(b: Pick<Booking, "start" | "end">): number {
  return (new Date(b.end).getTime() - new Date(b.start).getTime()) / 86_400_000;
}

/** Returns a new array sorted by start date (does not mutate the input). */
export function sortByStart(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) => a.start.localeCompare(b.start));
}
