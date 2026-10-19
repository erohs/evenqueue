import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import type { IDrawEntrant } from "../interfaces/IDrawEntrant.ts";
import type { IPublicDrawInputs } from "../interfaces/IPublicDrawInputs.ts";
import type { IRankedEntrant } from "../interfaces/IRankedEntrant.ts";
import { compareRankedEntrants } from "./compareRankedEntrants.function.ts";
import { rankEntrant } from "./rankEntrant.function.ts";

/**
 * Runs a large draw in slices, so it can be spread across several requests without holding the whole waitlist in
 * memory. After the last slice the result equals the first `placesToKeep` places of a full draw. `placesToKeep` is
 * the units offered plus the backfill depth.
 */
export const keepBestEntrantsAcrossSlices = async (
    rule: IAllocationRule,
    nextSlice: readonly IDrawEntrant[],
    publicDrawInputs: IPublicDrawInputs,
    placesToKeep: number,
    bestSoFar: readonly IRankedEntrant[] = [],
): Promise<IRankedEntrant[]> => {
    const rankedSlice = await Promise.all(nextSlice.map((entrant) => rankEntrant(rule, entrant, publicDrawInputs)));
    return [...bestSoFar, ...rankedSlice].toSorted(compareRankedEntrants).slice(0, placesToKeep);
};
