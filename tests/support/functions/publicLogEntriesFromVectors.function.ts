import { parsePublicLog } from "#domain/public-log/functions/parsePublicLog.function.ts";
import type { IPublicLogEntry } from "#domain/public-log/interfaces/IPublicLogEntry.ts";
import vectors from "#tests/vectors/publicLog.json" with { type: "json" };
import { parsedOrFail } from "./parsedOrFail.function.ts";

/** The shared vector log, read through the same parser as any downloaded log, which drops the reference text. */
export const publicLogEntriesFromVectors = (): IPublicLogEntry[] => parsedOrFail(parsePublicLog(vectors.entries));
