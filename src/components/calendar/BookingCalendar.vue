<script setup lang="ts">
import { computed, watch } from "vue";
import { ScheduleXCalendar } from "@schedule-x/vue";
import { createCalendar, viewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import type { CalendarEvent } from "@/utils/calendar";

const props = withDefaults(
  defineProps<{
    items: CalendarEvent[];
    // "events" = admin (named, clickable); "availability" = client
    // (booked days struck out, read-only).
    mode?: "events" | "availability";
  }>(),
  { mode: "events" },
);
const emit = defineEmits<{ selectItem: [id: string] }>();

const isAvailability = props.mode === "availability";

const eventsService = createEventsServicePlugin();
const today = new Date().toISOString().slice(0, 10);

const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

// Expand booked ranges into individual day strings.
function bookedDays(items: CalendarEvent[]): string[] {
  const out: string[] = [];
  for (const i of items) {
    const cur = fromISO(i.start);
    const end = fromISO(i.end);
    while (cur <= end) {
      out.push(toISO(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }
  return out;
}

// Schedule-X tags each day cell with data-date, so we can strike through the
// exact booked days — reads as "unavailable", not "selected".
const disabledCss = computed(() => {
  if (!isAvailability) return "";
  return bookedDays(props.items)
    .map(
      (d) =>
        `.sx__month-grid-day[data-date="${d}"] .sx__month-grid-day__header-date` +
        `{text-decoration:line-through;color:#bcbcbc}`,
    )
    .join("");
});

// IMPORTANT: a plain const, never a ref — the wrapper throws if calendarApp
// is reactive (it manages its own internal reactivity).
const calendarApp = createCalendar(
  {
    views: [viewMonthGrid],
    // Open on the month of the first event so something's visible.
    selectedDate: props.items[0]?.start ?? today,
    firstDayOfWeek: 1,
    events: isAvailability ? [] : props.items,
    calendars: {
      direct: {
        colorName: "direct",
        lightColors: { main: "#137a4b", container: "#d6f0e0", onContainer: "#0f5f3a" },
      },
      manual: {
        colorName: "manual",
        lightColors: { main: "#5b3ca8", container: "#e7e0f7", onContainer: "#3d2870" },
      },
      pending: {
        colorName: "pending",
        lightColors: { main: "#b8860b", container: "#fff3cd", onContainer: "#6b5200" },
      },
    },
    callbacks: isAvailability
      ? {}
      : { onEventClick: (event) => emit("selectItem", String(event.id)) },
  },
  [eventsService],
);

// Keep events in sync (events mode only).
watch(
  () => props.items,
  (items) => {
    if (!isAvailability) eventsService.set(items);
  },
);
</script>

<template>
  <ScheduleXCalendar :calendar-app="calendarApp" />

  <!-- Dynamic per-date strikethrough for booked days (availability mode). -->
  <Teleport to="head">
    <component :is="'style'" v-if="disabledCss" v-text="disabledCss" />
  </Teleport>
</template>

<!-- Not scoped: the calendar root is rendered by the child wrapper. -->
<style>
.sx-vue-calendar-wrapper {
  height: 100%;
}
</style>
