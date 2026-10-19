import { compareLowerFirst } from "#domain/shared/ordering/functions/compareLowerFirst.function.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";

/** By public draw id, so the root is canonical and a leaf's position says nothing about when the place joined. */
export const sortLeavesForCommitment = (leaves: readonly IWaitlistLeaf[]): IWaitlistLeaf[] => {
    const sorted = leaves.toSorted((first, second) => compareLowerFirst(first.publicDrawId, second.publicDrawId));
    if (sorted.some((leaf, i) => i > 0 && leaf.publicDrawId === sorted[i - 1]?.publicDrawId)) {
        throw new RangeError("two leaves share a public draw id");
    }
    return sorted;
};
