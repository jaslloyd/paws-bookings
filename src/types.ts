// Shared domain types. Imported by both the app and child components.

export type BookingSource = "direct" | "pawshake";

export interface Booking {
  id: string;
  clientName: string;
  petNames: string;
  start: string; // ISO date, e.g. '2026-07-03'
  end: string;
  source: BookingSource;
  notes?: string;
}
