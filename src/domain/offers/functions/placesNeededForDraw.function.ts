import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";

/**
 * How many places of the draw order to keep: enough for every unit's first offer and every backfill offer, even if
 * every offer lapses.
 */
export const placesNeededForDraw = (units: Count, backfillOffersPerUnit: Count): Count =>
    toCount(units * (1 + backfillOffersPerUnit));
