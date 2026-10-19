import { parsedList } from "#domain/shared/parsing/functions/parsedList.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { IPublicLogEntry } from "../interfaces/IPublicLogEntry.ts";
import { parsePublicLogEntry } from "./parsePublicLogEntry.function.ts";

/** A log downloaded by the verifier or read from a backup. Replay it with findLogProblems once it parses. */
export const parsePublicLog = (value: unknown): ParseResult<IPublicLogEntry[]> =>
    parsedList(value, parsePublicLogEntry, "entry");
