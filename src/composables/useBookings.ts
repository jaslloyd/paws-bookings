import { ref, computed, watch } from "vue";
import type { Booking } from "../types";
import { sortByStart, nightsBetween } from "../utils/bookings";

const STORAGE_KEY = "paws-bookings";

// Seed data — only used the very first time, before anything is saved.
const seedBookings: Booking[] = [
  {
    id: "1",
    clientName: "Sarah Connor",
    petNames: "Rex",
    start: "2026-07-03",
    end: "2026-07-07",
    source: "pawshake",
  },
  {
    id: "2",
    clientName: "John Wick",
    petNames: "Daisy, Max",
    start: "2026-07-10",
    end: "2026-07-12",
    source: "direct",
    notes: "Daisy needs medication twice a day",
  },
];

// Read from localStorage on startup; fall back to the seed if nothing's saved.
function loadBookings(): Booking[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedBookings;
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return seedBookings; // corrupted/old data — don't crash, just reseed
  }
}

/**
 * All booking state + operations in one place.
 * This is the seam we'll swap for Supabase in Phase 2 — the components
 * that consume it won't need to change.
 */
export function useBookings() {
  const bookings = ref<Booking[]>(loadBookings());

  // Persist on every change. deep: true so nested mutations (push) are caught.
  watch(
    bookings,
    (current) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    },
    { deep: true },
  );

  const sortedBookings = computed(() => sortByStart(bookings.value));

  const totalNights = computed(() =>
    bookings.value.reduce((sum, b) => sum + nightsBetween(b), 0),
  );

  // Takes a booking's data (no id) and assigns a fresh id.
  function addBooking(data: Omit<Booking, "id">) {
    bookings.value.push({ id: crypto.randomUUID(), ...data });
  }

  function removeBooking(id: string) {
    bookings.value = bookings.value.filter((b) => b.id !== id);
  }

  return { bookings, sortedBookings, totalNights, addBooking, removeBooking };
}
