import type { IServiceGap } from "../interfaces/IServiceGap.ts";

/** Sorted by start, with overlapping or touching gaps joined into one. */
export const mergeServiceGaps = (gaps: readonly IServiceGap[]): IServiceGap[] =>
    gaps
        .toSorted((first, second) => first.startsAt - second.startsAt || first.endsAt - second.endsAt)
        .reduce<IServiceGap[]>((merged, gap) => {
            const last = merged.at(-1);
            if (!last || gap.startsAt > last.endsAt) return [...merged, gap];
            return [...merged.slice(0, -1), { startsAt: last.startsAt, endsAt: Math.max(last.endsAt, gap.endsAt) }];
        }, []);
