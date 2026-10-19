import { zeroCount } from "#domain/shared/counting/consts/zeroCount.const.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import type { IAllocationRule } from "../interfaces/IAllocationRule.ts";
import { toPriority } from "./toPriority.function.ts";

const everyonesPriority = toPriority(0);

/**
 * Every drop is a fresh random draw with the same chance for everyone, and nothing carries over, so newcomers are
 * never behind. For vendors whose newcomers must have fully equal odds from their first drop.
 */
export const createEqualChanceEachDropRule = (): IAllocationRule => ({
    id: "equal-chance-each-drop",
    shouldKeepPlacesBetweenDrops: false,
    priorityOf: () => everyonesPriority,
    placeAfterDrop: () => null,
    placeWithPriority: (placeId) => createWaitlistPlace(placeId, zeroCount),
});
