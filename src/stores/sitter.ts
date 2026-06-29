import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Service, Sitter } from "../types";

// Mock sitter — this is YOU. Later this comes from Supabase (one row for now,
// many once sitter onboarding opens). Hardcoded so we can build the FE.
const mockSitter: Sitter = {
  id: "sitter-1",
  slug: "jason-south-dublin",
  name: "Jason & Co.",
  headline: "Trusted dog care from a dog-loving duo",
  bio: "We've been minding dogs for years and treat every guest like our own. Big garden, daily walks, lots of cuddles. Shelter-volunteer experience with anxious and senior dogs.",
  area: "South Dublin",
  photos: [
    "https://picsum.photos/seed/paws1/640/480",
    "https://picsum.photos/seed/paws2/640/480",
    "https://picsum.photos/seed/paws3/640/480",
    "https://picsum.photos/seed/paws4/640/480",
    "https://picsum.photos/seed/paws5/640/480",
    "https://picsum.photos/seed/paws6/640/480",
    "https://picsum.photos/seed/paws7/640/480",
    "https://picsum.photos/seed/paws8/640/480",
  ],
  whatsapp: "+353 87 000 0000",
  services: [
    {
      id: "svc-boarding",
      name: "Overnight boarding",
      unit: "night",
      baseRate: 25,
      additionalPetRate: 12,
      active: true,
    },
    {
      id: "svc-daycare",
      name: "Day care",
      unit: "day",
      baseRate: 20,
      additionalPetRate: 10,
      active: true,
    },
  ],
};

export const useSitterStore = defineStore("sitter", () => {
  const sitter = ref<Sitter>(mockSitter);

  const activeServices = computed(() =>
    sitter.value.services.filter((s) => s.active),
  );

  function getService(id: string): Service | undefined {
    return sitter.value.services.find((s) => s.id === id);
  }

  return { sitter, activeServices, getService };
});
