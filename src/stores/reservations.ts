import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { DirectReservation, ManualBlock, Reservation } from "@/types";

// Bump the version suffix to force-ignore stale saved data (e.g. when the
// seed changes) — the old key is simply left behind.
const STORAGE_KEY = "paws-reservations-v2";

// Used only when nothing is saved yet.
const mkBlock = (id: string, start: string, end: string): ManualBlock => ({
  id,
  sitterId: "sitter-1",
  source: "manual",
  title: "Unavailable",
  start,
  end,
  status: "approved",
  createdAt: "2026-06-30T09:00:00.000Z",
  notes: "Imported from Pawshake availability.",
});

const seed: Reservation[] = [
  // A sample incoming request so the admin queue demos (pending requests do
  // NOT block availability — only approved bookings/blocks do).
  {
    id: "r1",
    sitterId: "sitter-1",
    source: "direct",
    serviceId: "svc-boarding",
    start: "2026-08-03",
    end: "2026-08-05",
    pets: 1,
    quotedPrice: 106,
    status: "pending",
    createdAt: "2026-06-29T10:00:00.000Z",
    contact: {
      name: "Aoife Byrne",
      email: "aoife@example.com",
      phone: "+353 86 123 4567",
    },
    petDetails: "Milo, 3yo Cocker Spaniel. Friendly, needs 2 walks a day.",
    message: "Away for a wedding — hoping you have space!",
  },

  // Real unavailability decoded from the Pawshake calendar (manual blocks).
  // Past dates are auto-unavailable, so these are future ranges only.
  mkBlock("b1", "2026-07-01", "2026-07-09"),
  mkBlock("b2", "2026-07-11", "2026-07-11"),
  mkBlock("b3", "2026-07-14", "2026-08-02"),
  mkBlock("b4", "2026-08-08", "2026-08-09"),
  mkBlock("b5", "2026-08-12", "2026-08-30"),
  mkBlock("b6", "2026-09-01", "2026-09-03"),
  mkBlock("b7", "2026-09-06", "2026-09-08"),
  mkBlock("b8", "2026-09-14", "2026-09-30"),
  mkBlock("b9", "2026-10-03", "2026-10-11"),
  mkBlock("b10", "2026-10-24", "2026-12-31"),
];

function load(): Reservation[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seed;
  try {
    return JSON.parse(raw) as Reservation[];
  } catch {
    return seed;
  }
}

type NewRequest = Omit<
  DirectReservation,
  "id" | "status" | "createdAt" | "source"
>;
type NewBlock = Omit<ManualBlock, "id" | "status" | "createdAt" | "source">;

export const useReservationsStore = defineStore("reservations", () => {
  const reservations = ref<Reservation[]>(load());

  watch(
    reservations,
    (current) => localStorage.setItem(STORAGE_KEY, JSON.stringify(current)),
    { deep: true },
  );

  const pending = computed(() =>
    reservations.value.filter((r) => r.status === "pending"),
  );

  function getReservation(id: string): Reservation | undefined {
    return reservations.value.find((r) => r.id === id);
  }

  // A client request — always starts "pending".
  function createRequest(data: NewRequest): DirectReservation {
    const reservation: DirectReservation = {
      ...data,
      source: "direct",
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    reservations.value.push(reservation);
    return reservation;
  }

  // A manual block — confirmed straight away (it just occupies the calendar).
  function addManualBlock(data: NewBlock): ManualBlock {
    const block: ManualBlock = {
      ...data,
      source: "manual",
      id: crypto.randomUUID(),
      status: "approved",
      createdAt: new Date().toISOString(),
    };
    reservations.value.push(block);
    return block;
  }

  function setStatus(id: string, status: Reservation["status"]) {
    const r = reservations.value.find((r) => r.id === id);
    if (r) r.status = status;
  }

  function removeReservation(id: string) {
    reservations.value = reservations.value.filter((r) => r.id !== id);
  }

  return {
    reservations,
    pending,
    getReservation,
    createRequest,
    addManualBlock,
    setStatus,
    removeReservation,
  };
});
