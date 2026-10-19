import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import type { IDrawEntrant } from "../interfaces/IDrawEntrant.ts";
import type { IPublicDrawInputs } from "../interfaces/IPublicDrawInputs.ts";
import type { IRankedEntrant } from "../interfaces/IRankedEntrant.ts";
import { compareRankedEntrants } from "./compareRankedEntrants.function.ts";
import { rankEntrant } from "./rankEntrant.function.ts";

/** Best first. A pure function of its inputs, so the public verifier reaches the same order from published data. */
export const orderEntrantsForDraw = async (
    rule: IAllocationRule,
    entrants: readonly IDrawEntrant[],
    publicDrawInputs: IPublicDrawInputs,
): Promise<IRankedEntrant[]> => {
    const ranked = await Promise.all(entrants.map((entrant) => rankEntrant(rule, entrant, publicDrawInputs)));
    return ranked.toSorted(compareRankedEntrants);
};
