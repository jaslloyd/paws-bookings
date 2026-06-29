import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useSitterStore } from "./sitter";
import { quoteForRange } from "@/utils/pricing";
import { formatEuro } from "@/utils/currency";

/**
 * The in-progress booking selection, shared across every UI that shows it
 * (desktop card, mobile bar, drawer). A singleton via Pinia, so they all
 * stay in sync automatically.
 */
export const useBookingDraftStore = defineStore("bookingDraft", () => {
  const sitterStore = useSitterStore(); // stores can use other stores

  const serviceId = ref(sitterStore.activeServices[0]?.id ?? "");
  const pets = ref(1);
  const start = ref("2026-08-03");
  const end = ref("2026-08-05");

  const service = computed(() =>
    sitterStore.activeServices.find((s) => s.id === serviceId.value),
  );

  const total = computed(() =>
    service.value
      ? quoteForRange(service.value, start.value, end.value, pets.value)
      : 0,
  );

  const formattedTotal = computed(() => formatEuro(total.value));

  function addPet() {
    pets.value++;
  }
  function removePet() {
    if (pets.value > 1) pets.value--;
  }

  return {
    serviceId,
    pets,
    start,
    end,
    service,
    total,
    formattedTotal,
    addPet,
    removePet,
  };
});
