import { ref, computed, watch, onMounted } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useBookingDraftStore } from "@/stores/bookingDraft";
import { supabase } from "@/lib/supabase";

export interface Cell {
  iso: string;
  day: number;
  available: boolean;
  booked: boolean; // unavailable specifically because it's booked/blocked
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/**
 * All the availability-calendar logic: which days are bookable, month
 * navigation (responsive 1 or 2 months), and range selection wired to the
 * booking draft. The component just renders what this returns.
 */
export function useAvailabilityCalendar() {
  const draft = useBookingDraftStore();

  // Public availability comes from the PII-free `availability` view (booked
  // ranges only — no client names/contact). The composable owns this fetch.
  const bookedRanges = ref<{ start: string; end: string }[]>([]);
  onMounted(async () => {
    const { data, error } = await supabase
      .from("availability")
      .select("start_date, end_date");
    if (error) {
      console.error("Failed to load availability:", error.message);
      return;
    }
    bookedRanges.value = (data ?? []).map((r) => ({
      start: r.start_date,
      end: r.end_date,
    }));
  });

  // Expand the ranges into a set of individual booked day strings.
  const bookedSet = computed(() => {
    const out = new Set<string>();
    for (const r of bookedRanges.value) {
      const cur = fromISO(r.start);
      const end = fromISO(r.end);
      while (cur <= end) {
        out.add(toISO(cur));
        cur.setDate(cur.getDate() + 1);
      }
    }
    return out;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = toISO(today);

  const isAvailable = (iso: string) =>
    iso >= todayISO && !bookedSet.value.has(iso);

  // ── Month building ──────────────────────────────────────────
  const viewMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1));
  const shift = (n: number) => {
    viewMonth.value = new Date(
      viewMonth.value.getFullYear(),
      viewMonth.value.getMonth() + n,
      1,
    );
  };

  function buildMonth(base: Date) {
    const year = base.getFullYear();
    const month = base.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon-based
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Cell | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null); // leading blanks
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISO(new Date(year, month, d));
      cells.push({
        iso,
        day: d,
        available: isAvailable(iso),
        booked: bookedSet.value.has(iso),
      });
    }
    // Pad to 6 full weeks (42 cells) so every month is the same height.
    while (cells.length < 42) cells.push(null);
    return { label: `${MONTHS[month]} ${year}`, cells };
  }

  // One month on phones, two on wider screens. We track this in JS (not just a
  // CSS query) because we change *how many months we build*, and the "next"
  // arrow lives on the last rendered month — a single mobile month must get
  // BOTH arrows. VueUse's useMediaQuery gives a reactive ref and handles the
  // listener + cleanup for us.
  const isMobile = useMediaQuery("(max-width: 700px)");

  const months = computed(() => {
    const list = [buildMonth(viewMonth.value)];
    if (!isMobile.value) {
      const next = new Date(
        viewMonth.value.getFullYear(),
        viewMonth.value.getMonth() + 1,
        1,
      );
      list.push(buildMonth(next));
    }
    return list;
  });

  // ── Range selection ─────────────────────────────────────────
  // True only if EVERY day in the inclusive range is available — stops a
  // selection from spanning across booked days.
  function rangeAvailable(a: string, b: string): boolean {
    const cur = fromISO(a);
    const end = fromISO(b);
    while (cur <= end) {
      if (!isAvailable(toISO(cur))) return false;
      cur.setDate(cur.getDate() + 1);
    }
    return true;
  }

  const rangeStart = ref<string | null>(draft.start || null);
  const rangeEnd = ref<string | null>(draft.end || null);
  const hovered = ref<string | null>(null);
  const clearHover = () => (hovered.value = null);

  // While picking the 2nd date, preview the range to the hovered day.
  const previewEnd = computed(() => {
    const s = rangeStart.value;
    const h = hovered.value;
    if (s && !rangeEnd.value && h && h >= s && rangeAvailable(s, h)) return h;
    return null;
  });

  function onCellClick(cell: Cell | null) {
    if (!cell || !cell.available) return;
    const s = rangeStart.value;

    if (!s || rangeEnd.value) {
      rangeStart.value = cell.iso; // start a fresh selection
      rangeEnd.value = null;
      return;
    }
    if (cell.iso < s || !rangeAvailable(s, cell.iso)) {
      rangeStart.value = cell.iso; // earlier than start, or crosses a booking
      rangeEnd.value = null;
      return;
    }
    // valid end → commit to the draft. Use the narrowed `s` and `cell.iso`
    // (both definitely strings here) rather than the `string | null` refs.
    rangeEnd.value = cell.iso;
    draft.start = s;
    draft.end = cell.iso;
  }

  function onCellEnter(cell: Cell | null) {
    if (cell?.available) hovered.value = cell.iso;
  }

  function cellSelection(cell: Cell | null): string | null {
    if (!cell) return null;
    const start = rangeStart.value;
    if (!start) return null;
    const iso = cell.iso;
    const end = rangeEnd.value ?? previewEnd.value ?? start;
    if (iso === start && iso === end) return "sel-single";
    if (iso === start) return "sel-start";
    if (iso === end) return "sel-end";
    if (iso > start && iso < end) return "sel-range";
    return null;
  }

  // Keep selection in sync if the dates change elsewhere (e.g. widget inputs).
  watch(
    () => [draft.start, draft.end] as const,
    ([s, e]) => {
      rangeStart.value = s || null;
      rangeEnd.value = e || null;
    },
  );

  return {
    months,
    shift,
    clearHover,
    onCellClick,
    onCellEnter,
    cellSelection,
  };
}
