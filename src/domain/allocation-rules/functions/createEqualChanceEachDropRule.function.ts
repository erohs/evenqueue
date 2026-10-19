import type { IAllocationRule } from "../interfaces/IAllocationRule.ts";

/**
 * Every drop is a fresh random draw with the same chance for everyone, and nothing carries over, so newcomers are
 * never behind. For vendors whose newcomers must have fully equal odds from their first drop.
 */
export const createEqualChanceEachDropRule = (): IAllocationRule => ({
    id: "equal-chance-each-drop",
    shouldKeepPlacesBetweenDrops: false,
    priorityOf: () => 0,
    placeAfterDrop: () => null,
});
