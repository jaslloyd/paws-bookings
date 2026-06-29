import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { Booking } from "@/types";
import { sortByStart, nightsBetween } from "@/utils/bookings";

const STORAGE_KEY = "paws-bookings";

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

function loadBookings(): Booking[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedBookings;
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return seedBookings;
  }
}

// A "setup store": the callback is identical in shape to our composable.
//   ref()      → state
//   computed() → getters
//   functions  → actions
// defineStore guarantees ONE shared instance (a real singleton), and wires
// up devtools, SSR, hot-reload, etc.
export const useBookingsStore = defineStore("bookings", () => {
  const bookings = ref<Booking[]>(loadBookings());

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

  function addBooking(data: Omit<Booking, "id">) {
    bookings.value.push({ id: crypto.randomUUID(), ...data });
  }

  function removeBooking(id: string) {
    bookings.value = bookings.value.filter((b) => b.id !== id);
  }

  function getBooking(id: string): Booking | undefined {
    return bookings.value.find((b) => b.id === id);
  }

  return {
    bookings,
    sortedBookings,
    totalNights,
    addBooking,
    removeBooking,
    getBooking,
  };
});
