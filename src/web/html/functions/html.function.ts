import { markupMadeByHtml } from "../consts/markupMadeByHtml.const.ts";
import type { ISafeHtml } from "../interfaces/ISafeHtml.ts";
import type { HtmlValue } from "../types/HtmlValue.type.ts";
import { htmlOfValue } from "./htmlOfValue.function.ts";

/**
 * The only way pages are written: the template's own text is trusted markup and every value is escaped, so vendor
 * text or a typed code can never become markup.
 */
export const html = (template: TemplateStringsArray, ...values: readonly HtmlValue[]): ISafeHtml => {
    const markup = Object.freeze({
        safeHtml: template.reduce(
            (written, part, i) => written + part + (i < values.length ? htmlOfValue(values[i] ?? null) : ""),
            "",
        ),
    });
    markupMadeByHtml.add(markup);
    return markup;
};
