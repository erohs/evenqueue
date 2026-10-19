import { zeroCount } from "#domain/shared/counting/consts/zeroCount.const.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { IDrawInProgress } from "../interfaces/IDrawInProgress.ts";

/** `placesToKeep` is the units offered plus the backfill depth. */
export const startDrawInSlices = (placesToKeep: Count): IDrawInProgress => ({
    placesToKeep,
    slicesAdded: zeroCount,
    bestSoFar: [],
});
