import type { Priority } from "#domain/allocation-rules/types/Priority.type.ts";
import { zeroCount } from "#domain/shared/counting/consts/zeroCount.const.ts";
import { incrementCount } from "#domain/shared/counting/functions/incrementCount.function.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { IPriorityCount } from "../interfaces/IPriorityCount.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";

/** Highest priority first. */
export const countPlacesByPriority = (leaves: readonly IWaitlistLeaf[]): IPriorityCount[] => {
    const counts = new Map<Priority, Count>();
    for (const leaf of leaves) counts.set(leaf.priority, incrementCount(counts.get(leaf.priority) ?? zeroCount));
    return [...counts]
        .map(([priority, placeCount]) => ({ priority, placeCount }))
        .toSorted((first, second) => second.priority - first.priority);
};
