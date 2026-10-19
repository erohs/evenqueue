import type { ILogCheckpoint } from "../interfaces/ILogCheckpoint.ts";
import type { IPublicLogEntry } from "../interfaces/IPublicLogEntry.ts";
import { checkpointOfLog } from "./checkpointOfLog.function.ts";

/**
 * Whether a log continues from a checkpoint a buyer saved earlier, rather than rewriting what came before or being
 * cut short. Check the log itself with findLogProblems first.
 */
export const doesLogExtendCheckpoint = (entries: readonly IPublicLogEntry[], saved: ILogCheckpoint): boolean =>
    entries.length >= saved.entryCount && checkpointOfLog(entries, saved.entryCount).headHash === saved.headHash;
