import { canonicalJsonKeyPattern } from "../consts/canonicalJsonKeyPattern.const.ts";
import type { JsonValue } from "../types/JsonValue.type.ts";

const canonicalField = ([key, field]: [string, JsonValue]): string => {
    if (!canonicalJsonKeyPattern.test(key)) throw new TypeError(`"${key}" is not a plain field name`);
    return `${JSON.stringify(key)}:${canonicalJson(field)}`;
};

/**
 * JSON with object keys sorted at every level and no spaces, so the same value always gives the same text. Numbers
 * are safe integers, strings well-formed and keys plain ASCII names: within those limits the output matches RFC 8785
 * and any language can reproduce it, so anything outside them is refused.
 */
export const canonicalJson = (value: JsonValue): string => {
    if (typeof value === "number" && !Number.isSafeInteger(value)) {
        throw new RangeError("log numbers must be safe integers");
    }
    if (typeof value === "string" && !value.isWellFormed()) throw new TypeError("log strings must be well-formed");
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map((item: JsonValue) => canonicalJson(item)).join(",")}]`;
    const fields = Object.entries(value).toSorted(([first], [second]) => (first < second ? -1 : 1));
    return `{${fields.map(canonicalField).join(",")}}`;
};
