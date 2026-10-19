import { compareLowerFirst } from "#domain/shared/ordering/functions/compareLowerFirst.function.ts";
import type { IRankedLeaf } from "../interfaces/IRankedLeaf.ts";

/**
 * Best first: higher priority, then the lower random tiebreak key. Two public draw ids cannot share a key in
 * practice; comparing the ids last keeps the order total regardless.
 */
export const compareRankedLeaves = (first: IRankedLeaf, second: IRankedLeaf): number => {
    if (first.priority !== second.priority) return second.priority - first.priority;
    return (
        compareLowerFirst(first.randomTiebreakKey, second.randomTiebreakKey) ||
        compareLowerFirst(first.publicDrawId, second.publicDrawId)
    );
};
