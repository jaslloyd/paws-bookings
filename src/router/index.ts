import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import ReservationDetailView from "@/views/ReservationDetailView.vue";
import SitterProfileView from "@/views/SitterProfileView.vue";
import BookingFlowView from "@/views/BookingFlowView.vue";

const router = createRouter({
  // HTML5 history mode — real URLs, no #hash.
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/admin", name: "admin", component: AdminView },
    {
      path: "/admin/reservations/:id",
      name: "reservation-detail",
      component: ReservationDetailView,
    },
    // Public per-sitter pages
    { path: "/s/:slug", name: "sitter", component: SitterProfileView },
    { path: "/s/:slug/book", name: "book", component: BookingFlowView },
  ],
});

export default router;
