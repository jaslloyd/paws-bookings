import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";
import BookingDetailView from "../views/BookingDetailView.vue";

const router = createRouter({
  // HTML5 history mode — real URLs, no #hash.
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/admin", name: "admin", component: AdminView },
    {
      // `:id` is a dynamic route param, available as route.params.id
      path: "/bookings/:id",
      name: "booking-detail",
      component: BookingDetailView,
    },
  ],
});

export default router;
