<script setup lang="ts">
import { watch } from "vue";
import { ScheduleXCalendar } from "@schedule-x/vue";
import { createCalendar, viewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import type { CalendarEvent } from "@/utils/calendar";

const props = withDefaults(
  defineProps<{
    items: CalendarEvent[];
    // "events" = admin (named, clickable); "availability" = client
    // (gray shaded days, read-only).
    mode?: "events" | "availability";
  }>(),
  { mode: "events" },
);
const emit = defineEmits<{ selectItem: [id: string] }>();

const isAvailability = props.mode === "availability";

// Lets us push event updates to the calendar reactively.
const eventsService = createEventsServicePlugin();

const today = new Date().toISOString().slice(0, 10);

// Availability mode shades the booked ranges as gray background events
// (greys the whole day) instead of titled bars.
const toBackground = (items: CalendarEvent[]) =>
  items.map((i) => ({
    start: i.start,
    end: i.end,
    title: "Unavailable",
    style: { backgroundColor: "#e9e9e9", color: "#9a9a9a" },
  }));

// IMPORTANT: a plain const, never a ref — the wrapper throws if calendarApp
// is reactive (it manages its own internal reactivity).
const calendarApp = createCalendar(
  {
    views: [viewMonthGrid],
    // Open on the month of the first event so something's visible.
    selectedDate: props.items[0]?.start ?? today,
    firstDayOfWeek: 1,
    events: isAvailability ? [] : props.items,
    backgroundEvents: isAvailability ? toBackground(props.items) : [],
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
      busy: {
        colorName: "busy",
        lightColors: { main: "#8a8a8a", container: "#ededed", onContainer: "#555555" },
      },
    },
    callbacks: isAvailability
      ? {}
      : { onEventClick: (event) => emit("selectItem", String(event.id)) },
  },
  [eventsService],
);

// Keep the calendar in sync when the source data changes.
watch(
  () => props.items,
  (items) => {
    if (isAvailability) eventsService.setBackgroundEvents(toBackground(items));
    else eventsService.set(items);
  },
);
</script>

<template>
  <ScheduleXCalendar :calendar-app="calendarApp" />
</template>

<!-- Not scoped: the calendar root is rendered by the child wrapper. -->
<style>
.sx-vue-calendar-wrapper {
  height: 100%;
}
</style>
