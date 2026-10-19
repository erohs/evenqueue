import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IDrop } from "../interfaces/IDrop.ts";
import { entryWindowCloseOf } from "./entryWindowCloseOf.function.ts";

/** True while buyers can join: the drop is open and its entry window's uptime has not run out. */
export const isDropOpenForEntry = (drop: IDrop, gaps: readonly IServiceGap[], now: EpochMilliseconds): boolean => {
    const closesAt = entryWindowCloseOf(drop, gaps);
    return (
        drop.state === "open" && drop.openedAt !== null && closesAt !== null && now >= drop.openedAt && now < closesAt
    );
};
