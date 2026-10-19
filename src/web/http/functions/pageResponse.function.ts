import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { IPageResponseOptions } from "../interfaces/IPageResponseOptions.ts";
import { contentSecurityPolicy } from "./contentSecurityPolicy.function.ts";

/**
 * Every buyer page is `no-store`: pages carry codes or a form token, and a cached token would give two buyers the same
 * codes. No page sends a referrer, so a vendor's site never learns which page a buyer came from.
 */
export const pageResponse = (page: ISafeHtml, options: IPageResponseOptions = {}): Response => {
    const headers = new Headers({
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "content-security-policy": contentSecurityPolicy(options.embedOrigins ?? []),
        "referrer-policy": "no-referrer",
        "x-content-type-options": "nosniff",
        "cross-origin-opener-policy": "same-origin",
    });
    if (options.shouldClearCache === true) headers.set("clear-site-data", '"cache"');
    if (options.retryAfterSeconds !== undefined) headers.set("retry-after", String(options.retryAfterSeconds));
    if (options.allowedMethods !== undefined) headers.set("allow", options.allowedMethods.join(", "));
    return new Response(page.safeHtml, { status: options.status ?? 200, headers });
};
