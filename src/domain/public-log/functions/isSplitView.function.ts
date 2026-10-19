import type { ILogCheckpoint } from "../interfaces/ILogCheckpoint.ts";

/** Two checkpoints of the same size with different heads prove the vendor showed people different logs. */
export const isSplitView = (first: ILogCheckpoint, second: ILogCheckpoint): boolean =>
    first.entryCount === second.entryCount && first.headHash !== second.headHash;
