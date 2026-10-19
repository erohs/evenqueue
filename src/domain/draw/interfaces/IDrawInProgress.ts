import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { IRankedLeaf } from "./IRankedLeaf.ts";

/** A draw run in slices across several requests: the best leaves so far, and how many slices are in. */
export interface IDrawInProgress {
    readonly placesToKeep: Count;
    readonly slicesAdded: Count;
    readonly bestSoFar: readonly IRankedLeaf[];
}
