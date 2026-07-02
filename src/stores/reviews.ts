import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Review } from "@/types";
import { supabase } from "@/lib/supabase";

// Reviews now come from Supabase. The `reviews` columns (id, author, rating,
// date, text) match the Review type 1:1, so no snake→camel mapping is needed.
export const useReviewsStore = defineStore("reviews", () => {
  const reviews = ref<Review[]>([]);
  const isLoading = ref(false);
  const loaded = ref(false);

  // Idempotent: safe to call from multiple components (header + reviews page).
  async function fetch() {
    if (loaded.value || isLoading.value) return;
    isLoading.value = true;
    const { data, error } = await supabase
      .from("reviews")
      .select("id, author, rating, date, text")
      .order("date", { ascending: false });
    isLoading.value = false;
    if (error) {
      console.error("Failed to load reviews:", error.message);
      return;
    }
    reviews.value = (data ?? []) as Review[];
    loaded.value = true;
  }

  const count = computed(() => reviews.value.length);
  const average = computed(() =>
    reviews.value.length
      ? reviews.value.reduce((sum, r) => sum + r.rating, 0) /
        reviews.value.length
      : 0,
  );
  const sorted = computed(() =>
    [...reviews.value].sort((a, b) => b.date.localeCompare(a.date)),
  );

  async function addReview(data: Omit<Review, "id">) {
    // Single sitter for now; sitter_id will come from context once multi-sitter.
    const { data: row, error } = await supabase
      .from("reviews")
      .insert({ ...data, sitter_id: "sitter-1" })
      .select("id, author, rating, date, text")
      .single();
    if (error) {
      console.error("Failed to add review:", error.message);
      return;
    }
    if (row) reviews.value.push(row as Review);
  }

  return { reviews, sorted, count, average, isLoading, fetch, addReview };
});
