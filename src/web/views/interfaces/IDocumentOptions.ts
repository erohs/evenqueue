import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";

export interface IDocumentOptions {
    /** The page's own name, shown first in the tab title; screen readers announce it on arrival. */
    readonly title: string;
    /** The waitlist's neutral label, shown after the page name. */
    readonly waitlistLabel: string | null;
    readonly main: ISafeHtml;
}
