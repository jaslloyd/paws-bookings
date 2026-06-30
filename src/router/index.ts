import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import ReservationDetailView from "@/views/ReservationDetailView.vue";
import SitterProfileView from "@/views/SitterProfileView.vue";
import BookingFlowView from "@/views/BookingFlowView.vue";

// Type the per-route `meta.title` via declaration merging, so `to.meta.title`
// is `string | undefined` (not `unknown`) everywhere.
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
  }
}

const router = createRouter({
  // HTML5 history mode — real URLs, no #hash.
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView, meta: { title: "Dashboard" } },
    { path: "/admin", name: "admin", component: AdminView, meta: { title: "Admin" } },
    {
      path: "/admin/reservations/:id",
      name: "reservation-detail",
      component: ReservationDetailView,
      meta: { title: "Reservation" },
    },
    // Public per-sitter pages. The profile sets its own DYNAMIC title (sitter
    // name) via useTitle, so it has no static meta.title.
    { path: "/s/:slug", name: "sitter", component: SitterProfileView },
    {
      path: "/s/:slug/book",
      name: "book",
      component: BookingFlowView,
      meta: { title: "Request a booking" },
    },
    {
      path: "/s/:slug/reviews",
      name: "reviews",
      component: () => import("@/views/ReviewsView.vue"),
      meta: { title: "Reviews" },
    },
  ],
});

// Set the tab title ONLY for routes that declare a static one. Routes that
// set their own dynamically (the profile, via useTitle) are left alone.
//
// Why the guard must be conditional: afterEach fires on EVERY navigation,
// including the profile's `router.replace({ query })` URL-sync on each booking
// change. An unconditional `else` reset here would clobber the dynamic sitter
// title on load and on every date/pets tweak.
router.afterEach((to) => {
  if (to.meta.title) document.title = `${to.meta.title} | Paws`;
});

export default router;
