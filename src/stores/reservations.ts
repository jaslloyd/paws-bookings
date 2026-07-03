import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type {
  DirectReservation,
  ManualBlock,
  Reservation,
  ReservationStatus,
} from "@/types";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "loading" | "success" | "error";

// ── Row (snake_case) → Reservation (camelCase, discriminated union) ──
interface ReservationRow {
  id: string;
  sitter_id: string;
  source: "direct" | "manual";
  start_date: string;
  end_date: string;
  status: ReservationStatus;
  created_at: string;
  notes: string | null;
  service_id: string | null;
  pets: number | null;
  quoted_price: number | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  pet_details: string | null;
  message: string | null;
  title: string | null;
}

const SELECT =
  "id, sitter_id, source, start_date, end_date, status, created_at, notes, " +
  "service_id, pets, quoted_price, contact_name, contact_email, " +
  "contact_phone, pet_details, message, title";

function rowToReservation(r: ReservationRow): Reservation {
  const base = {
    id: r.id,
    sitterId: r.sitter_id,
    start: r.start_date,
    end: r.end_date,
    status: r.status,
    createdAt: r.created_at,
    notes: r.notes ?? undefined,
  };
  if (r.source === "manual") {
    return { ...base, source: "manual", title: r.title ?? "" };
  }
  return {
    ...base,
    source: "direct",
    serviceId: r.service_id ?? "",
    pets: r.pets ?? 1,
    quotedPrice: r.quoted_price ?? 0,
    contact: {
      name: r.contact_name ?? "",
      email: r.contact_email ?? "",
      phone: r.contact_phone ?? undefined,
    },
    petDetails: r.pet_details ?? undefined,
    message: r.message ?? undefined,
  };
}

type NewRequest = Omit<
  DirectReservation,
  "id" | "status" | "createdAt" | "source"
>;
type NewBlock = Omit<ManualBlock, "id" | "status" | "createdAt" | "source">;

export const useReservationsStore = defineStore("reservations", () => {
  const reservations = ref<Reservation[]>([]);
  const status = ref<Status>("idle");

  async function fetch() {
    if (status.value === "loading" || status.value === "success") return;
    status.value = "loading";
    const { data, error } = await supabase
      .from("reservations")
      .select(SELECT)
      .order("start_date");
    if (error) {
      console.error("Failed to load reservations:", error.message);
      status.value = "error";
      return;
    }
    reservations.value = (data as unknown as ReservationRow[]).map(
      rowToReservation,
    );
    status.value = "success";
  }

  const pending = computed(() =>
    reservations.value.filter((r) => r.status === "pending"),
  );
  function getReservation(id: string): Reservation | undefined {
    return reservations.value.find((r) => r.id === id);
  }

  // Guest booking → insert a direct/pending row, return it (with DB-generated
  // id + created_at) and add it to local state.
  async function createRequest(
    data: NewRequest,
  ): Promise<DirectReservation | undefined> {
    const { data: row, error } = await supabase
      .from("reservations")
      .insert({
        sitter_id: data.sitterId,
        source: "direct",
        service_id: data.serviceId,
        start_date: data.start,
        end_date: data.end,
        status: "pending",
        pets: data.pets,
        quoted_price: data.quotedPrice,
        contact_name: data.contact.name,
        contact_email: data.contact.email,
        contact_phone: data.contact.phone ?? null,
        pet_details: data.petDetails ?? null,
        message: data.message ?? null,
        notes: data.notes ?? null,
      })
      .select(SELECT)
      .single();
    if (error || !row) {
      console.error("Failed to create request:", error?.message);
      return;
    }
    const created = rowToReservation(
      row as unknown as ReservationRow,
    ) as DirectReservation;
    reservations.value.push(created);
    return created;
  }

  async function addManualBlock(
    data: NewBlock,
  ): Promise<ManualBlock | undefined> {
    const { data: row, error } = await supabase
      .from("reservations")
      .insert({
        sitter_id: data.sitterId,
        source: "manual",
        title: data.title,
        start_date: data.start,
        end_date: data.end,
        status: "approved",
        notes: data.notes ?? null,
      })
      .select(SELECT)
      .single();
    if (error || !row) {
      console.error("Failed to add block:", error?.message);
      return;
    }
    const block = rowToReservation(
      row as unknown as ReservationRow,
    ) as ManualBlock;
    reservations.value.push(block);
    return block;
  }

  async function setStatus(id: string, next: ReservationStatus) {
    const { error } = await supabase
      .from("reservations")
      .update({ status: next })
      .eq("id", id);
    if (error) {
      console.error("Failed to update status:", error.message);
      return;
    }
    const r = reservations.value.find((r) => r.id === id);
    if (r) r.status = next;
  }

  async function removeReservation(id: string) {
    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Failed to delete reservation:", error.message);
      return;
    }
    reservations.value = reservations.value.filter((r) => r.id !== id);
  }

  return {
    reservations,
    status,
    pending,
    fetch,
    getReservation,
    createRequest,
    addManualBlock,
    setStatus,
    removeReservation,
  };
});
