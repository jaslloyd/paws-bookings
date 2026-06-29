<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useReservationsStore } from "@/stores/reservations";
import { bookedDates } from "@/utils/calendar";

const { reservations } = storeToRefs(useReservationsStore());

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

// Set of booked day strings for O(1) lookup.
const bookedSet = computed(
  () => new Set(bookedDates(reservations.value).map(toISO)),
);

const today = new Date();
today.setHours(0, 0, 0, 0);
const todayISO = toISO(today);

// First day of the left-hand month on screen.
const viewMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const shift = (n: number) => {
  viewMonth.value = new Date(
    viewMonth.value.getFullYear(),
    viewMonth.value.getMonth() + n,
    1,
  );
};

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Cell {
  iso: string;
  day: number;
  available: boolean;
}

function buildMonth(base: Date) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Cell | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null); // leading blanks
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toISO(new Date(year, month, d));
    const available = iso >= todayISO && !bookedSet.value.has(iso);
    cells.push({ iso, day: d, available });
  }
  // Always pad to 6 full weeks (42 cells) so every month is the same height
  // and the calendar doesn't "jump" when you change months.
  while (cells.length < 42) cells.push(null);
  return { label: `${MONTHS[month]} ${year}`, cells };
}

// One month on phones, two on wider screens.
//
// Why JS (matchMedia) and not just a CSS media query? Because we're changing
// *behaviour*, not just styling: how many months to actually build/render. A
// CSS query could hide the 2nd month, but the "next" arrow lives on the last
// rendered month, so it would disappear too. By tracking the breakpoint in a
// reactive ref, the `months` computed rebuilds (1 or 2) and the single mobile
// month correctly gets BOTH arrows. Rule of thumb: media queries for how things
// *look*, matchMedia for what the code *does*.
const MOBILE_QUERY = "(max-width: 700px)";
const isMobile = ref(
  typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches,
);
let mql: MediaQueryList | undefined;
const onMqlChange = (e: MediaQueryListEvent) => (isMobile.value = e.matches);
onMounted(() => {
  mql = window.matchMedia(MOBILE_QUERY);
  isMobile.value = mql.matches;
  mql.addEventListener("change", onMqlChange);
});
// Clean up the listener on unmount (like a useEffect cleanup) to avoid a leak.
onUnmounted(() => mql?.removeEventListener("change", onMqlChange));

const months = computed(() => {
  const list = [buildMonth(viewMonth.value)];
  if (!isMobile.value) {
    list.push(
      buildMonth(
        new Date(
          viewMonth.value.getFullYear(),
          viewMonth.value.getMonth() + 1,
          1,
        ),
      ),
    );
  }
  return list;
});
</script>

<template>
  <div class="availability">
    <div class="legend">
      <span class="swatch available" />
      Available
      <span class="swatch unavailable" />
      Not available
    </div>

    <div class="months">
      <div v-for="(m, idx) in months" :key="m.label" class="month">
        <div class="month-head">
          <button
            v-if="idx === 0"
            class="nav"
            type="button"
            aria-label="Previous month"
            @click="shift(-1)"
          >
            ‹
          </button>
          <span v-else class="nav-spacer" />

          <h3>{{ m.label }}</h3>

          <button
            v-if="idx === months.length - 1"
            class="nav"
            type="button"
            aria-label="Next month"
            @click="shift(1)"
          >
            ›
          </button>
          <span v-else class="nav-spacer" />
        </div>

        <div class="grid">
          <span v-for="(wd, i) in WEEKDAYS" :key="`wd-${i}`" class="weekday">
            {{ wd }}
          </span>
          <template v-for="(cell, i) in m.cells" :key="i">
            <span v-if="!cell" class="cell blank" />
            <span
              v-else
              class="cell"
              :class="cell.available ? 'available' : 'unavailable'"
            >
              {{ cell.day }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.availability {
  display: grid;
  gap: 1rem;
}

.legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #555;
}
.swatch {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
.swatch.available {
  background: #c4ecc9;
}
.swatch.unavailable {
  background: repeating-linear-gradient(
    45deg,
    #eee,
    #eee 3px,
    #d8d8d8 3px,
    #d8d8d8 6px
  );
}

.months {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* stacks the two months when there isn't room */
  gap: 2rem 3rem;
}

.month-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.month-head h3 {
  margin: 0;
  font-size: 1.05rem;
}
.nav {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #555;
  cursor: pointer;
  padding: 0 0.4rem;
}
.nav-spacer {
  width: 1.7rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 44px); /* fixed button size */
  gap: 5px;
}
.weekday {
  text-align: center;
  font-size: 0.72rem;
  color: #999;
  padding-bottom: 0.25rem;
}
.cell {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  border-radius: 10px;
}
.cell.available {
  background: #c4ecc9;
  color: #14532d;
  font-weight: 500;
}
.cell.unavailable {
  color: #c4c4c4;
}
</style>
