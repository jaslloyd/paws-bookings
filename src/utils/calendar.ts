import type { Reservation } from "@/types";

// Schedule-X event shape (structurally compatible with its
// CalendarEventExternal). All-day events use "YYYY-MM-DD" date strings.
// `calendarId` selects a colour defined on the calendar.
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  calendarId: string;
}

// Admin calendar: every reservation, titled, coloured by status/source.
export function toAdminItems(reservations: Reservation[]): CalendarEvent[] {
  return reservations.map((r) => ({
    id: r.id,
    title: r.source === "direct" ? r.contact.name : r.title,
    start: r.start,
    end: r.end,
    calendarId: r.status === "pending" ? "pending" : r.source,
  }));
}

// Client availability: only confirmed bookings/blocks, anonymised.
export function toBusyItems(reservations: Reservation[]): CalendarEvent[] {
  return reservations
    .filter((r) => r.status === "approved")
    .map((r) => ({
      id: r.id,
      title: "Unavailable",
      start: r.start,
      end: r.end,
      calendarId: "busy",
    }));
}
