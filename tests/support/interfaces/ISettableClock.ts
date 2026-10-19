import type { IClock } from "#application/ports/interfaces/IClock.ts";

export interface ISettableClock extends IClock {
    advanceBy: (milliseconds: number) => void;
}
