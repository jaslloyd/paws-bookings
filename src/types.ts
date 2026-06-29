// ── Shared domain types ───────────────────────────────────────

// NOTE: `Booking` is the original simple admin model. It's being superseded
// by `Reservation` (below) and will be migrated when we build the booking
// flow. Kept for now so the existing admin pages keep working.
export type BookingSource = "direct" | "pawshake";

export interface Booking {
  id: string;
  clientName: string;
  petNames: string;
  start: string;
  end: string;
  source: BookingSource;
  notes?: string;
}

// ── Sitter & services ─────────────────────────────────────────

// How a service is measured/priced. night/day derive quantity from a date
// range; walk/hour/visit are count-based (booked as "3 walks").
export type PricingUnit = "night" | "day" | "walk" | "hour" | "visit";

export interface Service {
  id: string;
  name: string; // "Overnight boarding"
  unit: PricingUnit;
  baseRate: number; // price per unit for the first pet (euros for now)
  additionalPetRate: number; // price per unit for each extra pet
  active: boolean;
}

export interface Sitter {
  id: string;
  slug: string; // unique URL segment → /s/:slug
  name: string;
  headline: string; // short tagline under the name
  bio: string;
  area: string; // "South Dublin"
  photos: string[]; // image URLs
  services: Service[];
  whatsapp: string; // revealed to a client only after approval
}

// ── People & pets ─────────────────────────────────────────────

export type Role = "client" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Pet {
  id: string;
  ownerId: string; // → User.id
  name: string;
  type: string; // "Dog", "Cat"
  notes?: string;
  specialRequests?: string;
}

// ── Reservations ──────────────────────────────────────────────

export type ReservationStatus =
  | "pending"
  | "approved"
  | "denied"
  | "cancelled";

export interface Reservation {
  id: string;
  sitterId: string;
  clientId: string; // → User.id
  serviceId: string; // → Service.id
  start: string; // ISO date
  end: string;
  petIds: string[]; // → Pet.id[]
  quotedPrice: number; // snapshot of the agreed price at request time
  status: ReservationStatus;
  source: "direct" | "manual"; // manual = Pawshake / blocked dates
  createdAt: string; // ISO datetime
  notes?: string;
}
