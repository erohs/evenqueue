import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

/**
 * restored: the place is back where the draw left it; needs-vendor-review: the place was offered a unit in that draw,
 * and the public record cannot show whether it was bought, so the vendor decides from their sales records;
 * code-replaced: a published recovery replaced this code, so only the new code can restore the place;
 * not-kept: the rule starts every drop with an empty waitlist and the draw has run; not-in-draw: no place matches.
 */
export type PublishedDrawRestoreResult =
    | { readonly status: "restored"; readonly place: IWaitlistPlace }
    | { readonly status: "needs-vendor-review" }
    | { readonly status: "code-replaced" }
    | { readonly status: "not-kept" }
    | { readonly status: "not-in-draw" };
