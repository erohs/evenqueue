import type { LogProblemKind } from "../types/LogProblemKind.type.ts";

export interface ILogProblem {
    /** The position in the log as received, counted from 0. */
    readonly position: number;
    readonly kind: LogProblemKind;
}
