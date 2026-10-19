import { assertNonNegativeWholeNumber } from "#domain/shared/validation/functions/assertNonNegativeWholeNumber.function.ts";

/**
 * How many places of the draw order to keep: enough for every unit's first offer and every backfill offer, even if
 * every offer lapses.
 */
export const placesNeededForDraw = (units: number, backfillOffersPerUnit: number): number => {
    assertNonNegativeWholeNumber(units, "units");
    assertNonNegativeWholeNumber(backfillOffersPerUnit, "backfillOffersPerUnit");
    return units * (1 + backfillOffersPerUnit);
};
