import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { DirectReservation, ManualBlock, Reservation } from "@/types";

const STORAGE_KEY = "paws-reservations";

// Example data so the admin isn't empty on first run (used only when nothing
// is saved yet). Real ones arrive via the booking flow / manual blocks.
const seed: Reservation[] = [
  {
    id: "r1",
    sitterId: "sitter-1",
    source: "direct",
    serviceId: "svc-boarding",
    start: "2026-07-12",
    end: "2026-07-15",
    pets: 1,
    quotedPrice: 159,
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
  {
    id: "r2",
    sitterId: "sitter-1",
    source: "direct",
    serviceId: "svc-daycare",
    start: "2026-07-03",
    end: "2026-07-03",
    pets: 2,
    quotedPrice: 59,
    status: "approved",
    createdAt: "2026-06-20T09:00:00.000Z",
    contact: { name: "Liam Walsh", email: "liam@example.com" },
    petDetails: "Two Jack Russells, Pip and Pepper.",
  },
  {
    id: "r3",
    sitterId: "sitter-1",
    source: "manual",
    title: "Pawshake — Bella & Coco",
    start: "2026-07-20",
    end: "2026-07-24",
    status: "approved",
    createdAt: "2026-06-25T12:00:00.000Z",
    notes: "Booked through Pawshake.",
  },
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
