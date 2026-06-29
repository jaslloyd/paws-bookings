import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Service, Sitter } from "@/types";

// Mock sitter — this is YOU. Later this comes from Supabase (one row for now,
// many once sitter onboarding opens). Hardcoded so we can build the FE.
// Pulled from the real Pawshake profile. Photos are hot-linked from the
// Pawshake CDN for now — you'll re-upload + store your own later.
const CDN = "https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2";

const mockSitter: Sitter = {
  id: "sitter-1",
  slug: "jason-south-dublin",
  name: "Jason & Rachelle",
  avatar: `${CDN}/q3nf6kz7u1p8ng6k5eyldcvl.jpg`,
  rating: 5.0,
  reviewCount: 29,
  headline: "Trusted care from a dog-loving duo with shelter experience",
  bio: "Hi! We're Jason and Rachelle, a passionate couple of pet lovers with a deep appreciation for dogs of all shapes and sizes. We've volunteered extensively at Ash Animal Rescue, working with dogs of all temperaments — from helping nervous dogs learn to trust again to caring for rescues. We've raised our own dogs too: a Labrador, a Jack Russell, and a Pyrenean Sheepdog. We work from home, so we can provide round-the-clock care on weekdays and weekends. Our spacious duplex (90m²) has a safe courtyard for playtime, and we're near Memorial Park for regular walks. We don't have a residential dog at the moment and only accept one booking at a time. We do accept multiple dogs as long as they're from the same family.",
  area: "Dublin 8",
  photos: [
    `${CDN}/8xQD_b510RTeYq7laiGNo-gtQew.jpg`,
    `${CDN}/ytrx_6jyP8kBXQ55mT7tkagvaFI.jpg`,
    `${CDN}/NliegsoaPpcbeCXzdfalWptP-aI.jpg`,
    `${CDN}/aM0jtClQFH39RrMfM1dHEuB2Nfs.jpg`,
    `${CDN}/Km8GGMetRsGdWcr8tnrwkw0O0R4.jpg`,
    `${CDN}/8rbncTG7CA4Okk_CPWijyhdHXA0.jpg`,
    `${CDN}/yG9nR5FGDM2S4fx_NaUsLfRuOno.jpg`,
    `${CDN}/roch-W5tkRt0D9TJOzeqae-2DxM.jpg`,
    `${CDN}/1LbfVZENv5jWotQSnUCm54RK0qk.jpg`,
    `${CDN}/fDE1UJprFt0o8bfyWFbbLkJZTBw.jpg`,
    `${CDN}/0rSiRt-dQAaMdLYYIpJryGfMHbo.jpg`,
    `${CDN}/h6SIUsieyffgh9DDLJJQHyw6f_A.jpg`,
  ],
  whatsapp: "+353 87 000 0000",
  services: [
    {
      id: "svc-boarding",
      name: "Dog boarding",
      unit: "night",
      baseRate: 53,
      additionalPetRate: 24,
      active: true,
    },
    {
      id: "svc-daycare",
      name: "Doggy day care",
      unit: "day",
      baseRate: 42,
      additionalPetRate: 17,
      active: true,
    },
    {
      id: "svc-walking",
      name: "Dog walking",
      unit: "walk",
      baseRate: 15,
      additionalPetRate: 5,
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
