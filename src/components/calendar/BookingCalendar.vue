<script setup lang="ts">
import { watch } from "vue";
import { ScheduleXCalendar } from "@schedule-x/vue";
import { createCalendar, viewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import type { CalendarEvent } from "@/utils/calendar";

const props = defineProps<{ items: CalendarEvent[] }>();
const emit = defineEmits<{ selectItem: [id: string] }>();

// Lets us push event updates to the calendar reactively.
const eventsService = createEventsServicePlugin();

const today = new Date().toISOString().slice(0, 10);

// IMPORTANT: a plain const, never a ref — the wrapper throws if calendarApp
// is reactive (it manages its own internal reactivity).
const calendarApp = createCalendar(
  {
    views: [viewMonthGrid],
    // Open on the month of the first event so something's visible.
    selectedDate: props.items[0]?.start ?? today,
    firstDayOfWeek: 1,
    events: props.items,
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
    callbacks: {
      onEventClick: (event) => emit("selectItem", String(event.id)),
    },
  },
  [eventsService],
);

// Keep the calendar's events in sync when the source data changes.
watch(
  () => props.items,
  (items) => eventsService.set(items),
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
