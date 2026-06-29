import type { PricingUnit, Service } from "../types";

const MS_PER_DAY = 86_400_000;

/**
 * How many pricing units a date range represents, for range-based services.
 *  - night → nights between the two dates (3rd→7th = 4)
 *  - day   → inclusive days (3rd→3rd = 1)
 *  - count-based units (walk/hour/visit) aren't derived from a range; the
 *    caller supplies the quantity, so we return 1 as a neutral default here.
 */
export function quantityForRange(
  unit: PricingUnit,
  start: string,
  end: string,
): number {
  const days = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / MS_PER_DAY,
  );
  switch (unit) {
    case "night":
      return days;
    case "day":
      return days + 1;
    default:
      return 1;
  }
}

/**
 * Price for a service: quantity × (base + extra-pet rate × extra pets).
 * "Base + cheaper additional pet" model.
 */
export function quote(service: Service, quantity: number, pets: number): number {
  const extraPets = Math.max(0, pets - 1);
  const perUnit = service.baseRate + service.additionalPetRate * extraPets;
  return perUnit * quantity;
}

/** Convenience: quote directly from a date range. */
export function quoteForRange(
  service: Service,
  start: string,
  end: string,
  pets: number,
): number {
  return quote(service, quantityForRange(service.unit, start, end), pets);
}
