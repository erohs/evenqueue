import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";

/** Vendor text as plain paragraphs, split at blank lines; it is never read as markup. */
export const renderParagraphs = (text: string): ISafeHtml =>
    html`${text
        .split(/\r?\n\s*\r?\n/u)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph !== "")
        .map((paragraph) => html`<p>${paragraph}</p>`)}`;
