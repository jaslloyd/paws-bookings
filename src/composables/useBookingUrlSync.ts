import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingDraftStore } from "@/stores/bookingDraft";

const isISODate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

/**
 * Two-way bridge between the booking selection and the URL's query string,
 * so the page state is shareable + bookmarkable + survives a refresh, e.g.
 *   /s/jason?service=svc-boarding&pets=2&start=2026-08-03&end=2026-08-05
 *
 * The URL is the durable "source of truth" the user can copy; the store is the
 * live working copy the UI binds to.
 */
export function useBookingUrlSync() {
  const route = useRoute();
  const router = useRouter();
  const draft = useBookingDraftStore();

  // 1) Hydrate the draft FROM the URL on load. A shared link arrives with the
  //    selection already made, so we read it back into the store. Query values
  //    are always strings (or arrays/undefined), so each one is validated.
  const q = route.query;
  if (typeof q.service === "string") draft.serviceId = q.service;
  const pets = Number(q.pets);
  if (Number.isInteger(pets) && pets >= 1) draft.pets = pets;
  if (isISODate(q.start)) draft.start = q.start;
  if (isISODate(q.end)) draft.end = q.end;

  // 2) Reflect the selection back INTO the URL whenever it changes.
  //    - `replace` (not `push`) so we don't add a history entry on every date
  //      click — the back button should leave the page, not undo each tweak.
  //    - `immediate` so the URL reflects the current selection straight away.
  //    - merge with existing query so unrelated params are preserved.
  watch(
    () => ({
      service: draft.serviceId,
      pets: String(draft.pets),
      start: draft.start,
      end: draft.end,
    }),
    (params) => {
      router
        .replace({ query: { ...route.query, ...params } })
        .catch(() => {}); // ignore "redundant navigation" when nothing changed
    },
    { immediate: true },
  );
}
