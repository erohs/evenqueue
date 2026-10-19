import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IDrop } from "../interfaces/IDrop.ts";
import { dropStateAfterEvent } from "./dropStateAfterEvent.function.ts";

export const openDrop = (drop: IDrop, openedAt: EpochMilliseconds): IDrop => ({
    ...drop,
    state: dropStateAfterEvent(drop.state, "drop-opened"),
    openedAt,
});
