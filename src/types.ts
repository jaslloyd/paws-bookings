// ── Shared domain types ───────────────────────────────────────

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
  avatar: string; // small profile photo for the header
  headline: string; // short tagline under the name
  bio: string;
  area: string; // "South Dublin"
  photos: string[]; // gallery image URLs
  services: Service[];
  whatsapp: string; // revealed to a client only after approval
}

// A client review. Rating + count for the sitter are derived from these.
export interface Review {
  id: string;
  author: string;
  rating: number; // 1–5
  date: string; // ISO date
  text: string;
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
  | "declined"
  | "cancelled";

// Who the request is from. Inline for now — becomes a User reference once
// accounts exist (then we prefill this from the signed-in client).
export interface ReservationContact {
  name: string;
  email: string;
  phone?: string;
}

// Fields common to anything that occupies the calendar.
interface ReservationBase {
  id: string;
  sitterId: string;
  start: string; // ISO date
  end: string;
  status: ReservationStatus;
  createdAt: string; // ISO datetime
  notes?: string;
}

// A real client request made through the booking flow.
export interface DirectReservation extends ReservationBase {
  source: "direct";
  serviceId: string; // → Service.id
  pets: number; // count for now (Pet records come later)
  quotedPrice: number; // snapshot of the agreed price at request time
  contact: ReservationContact;
  petDetails?: string; // free text until pet profiles exist
  message?: string; // optional message to the sitter
}

// A manually blocked period (e.g. a Pawshake booking) — no client or price.
export interface ManualBlock extends ReservationBase {
  source: "manual";
  title: string; // label, e.g. "Pawshake — Bella"
}

// Discriminated union on `source`: TS narrows to the right shape once you
// check `reservation.source`.
export type Reservation = DirectReservation | ManualBlock;
