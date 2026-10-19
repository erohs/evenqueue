import type { ParseResult } from "../types/ParseResult.type.ts";
import { fieldProblems } from "./fieldProblems.function.ts";
import { isRecord } from "./isRecord.function.ts";

/**
 * Accepts a value whose fields each pass their guard and that breaks no rule across fields, keeping only the fields
 * named, so nothing unexpected rides along. The one place a checked outside value becomes a typed one.
 */
export const parsedFields = <T>(
    value: unknown,
    guards: Readonly<Record<keyof T & string, (field: unknown) => boolean>>,
    crossFieldProblems: (checked: T) => readonly string[] = () => [],
): ParseResult<T> => {
    if (!isRecord(value)) return { isValid: false, problems: ["not an object"] };
    const problems = fieldProblems(value, guards);
    if (problems.length > 0) return { isValid: false, problems };
    const checked = Object.fromEntries(Object.keys(guards).map((name) => [name, value[name]])) as T;
    const ruleProblems = crossFieldProblems(checked);
    return ruleProblems.length > 0 ? { isValid: false, problems: ruleProblems } : { isValid: true, value: checked };
};
