import { firstEntryPreviousHash } from "../consts/firstEntryPreviousHash.const.ts";
import type { ILogProblem } from "../interfaces/ILogProblem.ts";
import type { IPublicLogEntry } from "../interfaces/IPublicLogEntry.ts";
import { computeLogEntryHash } from "./computeLogEntryHash.function.ts";

/** Replays the whole chain. An empty list means it is intact. */
export const findLogProblems = async (entries: readonly IPublicLogEntry[]): Promise<ILogProblem[]> => {
    const problems: ILogProblem[] = [];
    for (const [position, entry] of entries.entries()) {
        const previous = entries[position - 1];
        if (entry.sequenceNumber !== position) problems.push({ position, kind: "out-of-sequence" });
        if (entry.previousHash !== (previous?.entryHash ?? firstEntryPreviousHash)) {
            problems.push({ position, kind: "broken-link" });
        }
        if (previous !== undefined && entry.recordedAt < previous.recordedAt) {
            problems.push({ position, kind: "time-went-backwards" });
        }
        if ((await computeLogEntryHash(entry)) !== entry.entryHash) problems.push({ position, kind: "altered" });
    }
    return problems;
};
