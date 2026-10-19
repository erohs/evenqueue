/**
 * No script may run at all, so the pages are guaranteed to work as plain HTML. Styles come only from this instance,
 * forms post only back to it, and only the listed sites may show the page in a frame.
 */
export const contentSecurityPolicy = (embedOrigins: readonly string[]): string =>
    [
        "default-src 'none'",
        "style-src 'self'",
        "img-src 'self'",
        "form-action 'self'",
        "base-uri 'none'",
        `frame-ancestors ${embedOrigins.length > 0 ? embedOrigins.join(" ") : "'none'"}`,
    ].join("; ");
