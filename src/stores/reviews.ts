import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Review } from "@/types";

// Pawshake's review text isn't readable from the page, so these are realistic
// placeholders in the right shape — REPLACE the text with your real reviews.
// This array is the base dataset; it maps 1:1 to a Supabase `reviews` table.
const seed: Review[] = [
  {
    id: "rv1",
    author: "Sarah M.",
    rating: 5,
    date: "2026-05-22",
    text: "Jason and Rachelle were amazing with our anxious rescue, Bobby. Daily photo updates and he came home so relaxed and happy. Couldn't recommend them more!",
  },
  {
    id: "rv2",
    author: "David K.",
    rating: 5,
    date: "2026-05-09",
    text: "Our Lab Bella had the best week. Lovely couple, great communication, and you can tell they genuinely love dogs. Will absolutely book again.",
  },
  {
    id: "rv3",
    author: "Aoife L.",
    rating: 5,
    date: "2026-04-27",
    text: "First time leaving our pup and they put us totally at ease. The courtyard and daily walks were perfect for her. 10/10.",
  },
  {
    id: "rv4",
    author: "Conor B.",
    rating: 5,
    date: "2026-04-15",
    text: "Super flexible with drop-off and pickup, and sent us updates throughout. Max clearly had a great time. Thank you both!",
  },
  {
    id: "rv5",
    author: "Niamh O.",
    rating: 5,
    date: "2026-03-30",
    text: "They looked after our senior dog with so much care, including his medication without any fuss. Real peace of mind.",
  },
  {
    id: "rv6",
    author: "Emma R.",
    rating: 5,
    date: "2026-03-12",
    text: "Brilliant from start to finish. Friendly, reliable and our two terriers were spoiled rotten. Highly recommend.",
  },
  {
    id: "rv7",
    author: "Liam W.",
    rating: 5,
    date: "2026-02-21",
    text: "Booked day care a few times now and it's always great. Easy to arrange and the dogs love going.",
  },
  {
    id: "rv8",
    author: "Grace H.",
    rating: 5,
    date: "2026-02-03",
    text: "Kind, professional and great with nervous dogs. Our collie warmed to them instantly. We'll be back!",
  },
];

export const useReviewsStore = defineStore("reviews", () => {
  const reviews = ref<Review[]>(seed);

  const count = computed(() => reviews.value.length);
  const average = computed(() =>
    reviews.value.length
      ? reviews.value.reduce((sum, r) => sum + r.rating, 0) /
        reviews.value.length
      : 0,
  );

  // Newest first.
  const sorted = computed(() =>
    [...reviews.value].sort((a, b) => b.date.localeCompare(a.date)),
  );

  function addReview(data: Omit<Review, "id">) {
    reviews.value.push({ id: crypto.randomUUID(), ...data });
  }

  return { reviews, sorted, count, average, addReview };
});
