import { markupMadeByHtml } from "../consts/markupMadeByHtml.const.ts";
import type { ISafeHtml } from "../interfaces/ISafeHtml.ts";
import type { HtmlValue } from "../types/HtmlValue.type.ts";
import { escapeHtml } from "./escapeHtml.function.ts";

/** Throws on an object `html` did not make, which only a programming mistake can produce. */
export const htmlOfValue = (value: HtmlValue): string => {
    if (value === null || value === false) return "";
    if (typeof value === "string") return escapeHtml(value);
    if (typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.map((item: HtmlValue) => htmlOfValue(item)).join("");
    if (!markupMadeByHtml.has(value as ISafeHtml)) throw new TypeError("only markup made by html can be inserted");
    return (value as ISafeHtml).safeHtml;
};
