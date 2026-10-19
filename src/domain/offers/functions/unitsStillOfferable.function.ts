import type { IUnitAwaitingOffer } from "../interfaces/IUnitAwaitingOffer.ts";

/** Units that have not used up their first offer and backfill offers, lowest unit number first. */
export const unitsStillOfferable = (
    units: readonly IUnitAwaitingOffer[],
    backfillOffersPerUnit: number,
): IUnitAwaitingOffer[] =>
    units
        .filter((unit) => unit.offersMade <= backfillOffersPerUnit)
        .toSorted((first, second) => first.unitNumber - second.unitNumber);
