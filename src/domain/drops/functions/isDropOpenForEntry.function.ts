import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import { windowClose } from "#domain/schedule/functions/windowClose.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IDrop } from "../interfaces/IDrop.ts";

/** True while buyers can join: the drop is open and its entry window's uptime has not run out. */
export const isDropOpenForEntry = (drop: IDrop, gaps: readonly IServiceGap[], now: EpochMilliseconds): boolean =>
    drop.state === "open" &&
    drop.openedAt !== null &&
    now >= drop.openedAt &&
    now < windowClose(drop.openedAt, drop.settings.entryWindow, gaps).closesAt;
