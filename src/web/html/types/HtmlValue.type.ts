import type { ISafeHtml } from "../interfaces/ISafeHtml.ts";

/** What may sit in an `html` template: text is escaped, markup kept, and null or false render nothing. */
export type HtmlValue = ISafeHtml | string | number | null | false | readonly HtmlValue[];
