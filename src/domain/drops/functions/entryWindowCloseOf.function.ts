import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import { windowClose } from "#domain/schedule/functions/windowClose.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IDrop } from "../interfaces/IDrop.ts";

/** When joining stops, outages included; null until the drop opens. */
export const entryWindowCloseOf = (drop: IDrop, gaps: readonly IServiceGap[]): EpochMilliseconds | null =>
    drop.openedAt === null ? null : windowClose(drop.openedAt, drop.settings.entryWindow, gaps).closesAt;
