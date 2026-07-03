import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { PricingUnit, Service, Sitter } from "@/types";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "loading" | "success" | "error";

// Non-null placeholder so consumers never need null-checks; the profile view
// gates rendering on `status` until the real sitter has loaded.
const EMPTY_SITTER: Sitter = {
  id: "",
  slug: "",
  name: "",
  avatar: "",
  headline: "",
  bio: "",
  area: "",
  photos: [],
  services: [],
  whatsapp: "",
};

// ── snake_case DB rows → camelCase domain types ────────────────
interface ServiceRow {
  id: string;
  name: string;
  unit: PricingUnit;
  base_rate: number;
  additional_pet_rate: number;
  active: boolean;
}
const rowToService = (r: ServiceRow): Service => ({
  id: r.id,
  name: r.name,
  unit: r.unit,
  baseRate: r.base_rate,
  additionalPetRate: r.additional_pet_rate,
  active: r.active,
});

interface SitterRow {
  id: string;
  slug: string;
  name: string;
  avatar: string | null;
  headline: string | null;
  bio: string | null;
  area: string | null;
  photos: string[] | null;
  whatsapp: string | null;
  services: ServiceRow[];
}
const rowToSitter = (r: SitterRow): Sitter => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  avatar: r.avatar ?? "",
  headline: r.headline ?? "",
  bio: r.bio ?? "",
  area: r.area ?? "",
  photos: r.photos ?? [],
  whatsapp: r.whatsapp ?? "",
  services: (r.services ?? []).map(rowToService),
});

export const useSitterStore = defineStore("sitter", () => {
  const sitter = ref<Sitter>(EMPTY_SITTER);
  const status = ref<Status>("idle");

  // Fetch a sitter (with its services) by slug. Idempotent per slug.
  async function fetch(slug: string) {
    if (
      status.value === "loading" ||
      (status.value === "success" && sitter.value.slug === slug)
    ) {
      return;
    }
    status.value = "loading";
    const { data, error } = await supabase
      .from("sitters")
      .select(
        "id, slug, name, avatar, headline, bio, area, photos, whatsapp, " +
          "services(id, name, unit, base_rate, additional_pet_rate, active)",
      )
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.error("Failed to load sitter:", error?.message);
      status.value = "error";
      return;
    }
    sitter.value = rowToSitter(data as unknown as SitterRow);
    status.value = "success";
  }

  const activeServices = computed(() =>
    sitter.value.services.filter((s) => s.active),
  );
  function getService(id: string): Service | undefined {
    return sitter.value.services.find((s) => s.id === id);
  }

  return { sitter, status, activeServices, getService, fetch };
});
