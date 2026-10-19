import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import { incrementCount } from "#domain/shared/counting/functions/incrementCount.function.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { IDrawInProgress } from "../interfaces/IDrawInProgress.ts";
import type { IPublicDrawInputs } from "../interfaces/IPublicDrawInputs.ts";
import { compareRankedLeaves } from "./compareRankedLeaves.function.ts";
import { rankLeaf } from "./rankLeaf.function.ts";

/**
 * Adds the next slice of the committed leaves, so a large draw can be spread across requests. Slices are numbered
 * from 0 in the committed order; a slice already added (a run repeated after a crash) changes nothing, and skipping
 * one is refused. After the last slice, the best leaves equal the top of a full draw.
 */
export const addSliceToDraw = async (
    draw: IDrawInProgress,
    sliceNumber: Count,
    slice: readonly IWaitlistLeaf[],
    publicDrawInputs: IPublicDrawInputs,
): Promise<IDrawInProgress> => {
    if (sliceNumber < draw.slicesAdded) return draw;
    if (sliceNumber > draw.slicesAdded) {
        throw new RangeError(`slice ${draw.slicesAdded} must be added before ${sliceNumber}`);
    }
    const ranked = await Promise.all(slice.map((leaf) => rankLeaf(leaf, publicDrawInputs)));
    const bestSoFar = [...draw.bestSoFar, ...ranked].toSorted(compareRankedLeaves).slice(0, draw.placesToKeep);
    return { placesToKeep: draw.placesToKeep, slicesAdded: incrementCount(draw.slicesAdded), bestSoFar };
};
