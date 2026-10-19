import type { IPriorityCount } from "../interfaces/IPriorityCount.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";

/** Highest priority first. */
export const countPlacesByPriority = (leaves: readonly IWaitlistLeaf[]): IPriorityCount[] => {
    const counts = new Map<number, number>();
    for (const leaf of leaves) counts.set(leaf.priority, (counts.get(leaf.priority) ?? 0) + 1);
    return [...counts]
        .map(([priority, placeCount]) => ({ priority, placeCount }))
        .toSorted((first, second) => second.priority - first.priority);
};
