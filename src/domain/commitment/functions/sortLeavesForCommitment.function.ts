import { compareLowerFirst } from "#domain/shared/ordering/functions/compareLowerFirst.function.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";

/** By public draw id, so the root is canonical and a leaf's position says nothing about when the place joined. */
export const sortLeavesForCommitment = (leaves: readonly IWaitlistLeaf[]): IWaitlistLeaf[] =>
    leaves.toSorted((first, second) => compareLowerFirst(first.publicDrawId, second.publicDrawId));
