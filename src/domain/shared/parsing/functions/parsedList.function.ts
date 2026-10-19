import type { ParseResult } from "../types/ParseResult.type.ts";

/** A list whose every item parses, or every item's problems, each prefixed with the item's position. */
export const parsedList = <T>(
    value: unknown,
    parseItem: (item: unknown) => ParseResult<T>,
    itemName: string,
): ParseResult<T[]> => {
    if (!Array.isArray(value)) return { isValid: false, problems: [`the ${itemName}s are not a list`] };
    const results = value.map((item: unknown) => parseItem(item));
    const problems = results.flatMap((result, i) =>
        result.isValid ? [] : result.problems.map((problem) => `${itemName} ${i}: ${problem}`),
    );
    if (problems.length > 0) return { isValid: false, problems };
    return { isValid: true, value: results.flatMap((result) => (result.isValid ? [result.value] : [])) };
};
