import type { JsonValue } from "../types/JsonValue.type.ts";
import { canonicalJson } from "./canonicalJson.function.ts";

/** For values parsed from outside: whether they can be written as canonical JSON, and so hashed the same everywhere. */
export const isCanonicalJsonValue = (value: unknown): value is JsonValue => {
    try {
        canonicalJson(value as JsonValue);
        return true;
    } catch {
        return false;
    }
};
