<script setup lang="ts">
import { useAvailabilityCalendar } from "@/composables/useAvailabilityCalendar";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const { months, shift, clearHover, onCellClick, onCellEnter, cellSelection } =
  useAvailabilityCalendar();
</script>

<template>
  <div class="availability">
    <div class="legend">
      <span class="swatch available" />
      Available
      <span class="swatch unavailable" />
      Not available
    </div>

    <div class="months" @mouseleave="clearHover">
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
              :class="[
                cell.available ? 'available' : 'unavailable',
                cellSelection(cell),
              ]"
              @click="onCellClick(cell)"
              @mouseenter="onCellEnter(cell)"
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
  cursor: pointer;
}
.cell.unavailable {
  color: #c4c4c4;
}

/* Selection — a distinct blue so it stands out from the available green.
   Defined after .available so it overrides the base colour. */
.cell.sel-range {
  background: #c7d7f7;
  color: #1e3a8a;
}
.cell.sel-start,
.cell.sel-end,
.cell.sel-single {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}
</style>
