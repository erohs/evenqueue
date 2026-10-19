import assert from "node:assert/strict";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";

/** The parsed value of fixture data, or a failed test naming every problem. */
export const parsedOrFail = <T>(result: ParseResult<T>): T =>
    result.isValid ? result.value : assert.fail(result.problems.join("; "));
