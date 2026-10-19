import type { Count } from "#domain/shared/counting/types/Count.type.ts";

/** Unit numbers that have not used up their first offer and backfill offers, lowest first, with offers made so far. */
export const unitsStillOfferable = (
    offersMadeByUnitNumber: ReadonlyMap<Count, Count>,
    backfillOffersPerUnit: Count,
): [Count, Count][] =>
    [...offersMadeByUnitNumber]
        .filter(([, offersMade]) => offersMade <= backfillOffersPerUnit)
        .toSorted(([first], [second]) => first - second);
