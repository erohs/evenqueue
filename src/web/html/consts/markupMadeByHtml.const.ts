import type { ISafeHtml } from "../interfaces/ISafeHtml.ts";

/** Every value `html` has made. Anything else shaped like markup is refused, so markup cannot be forged. */
export const markupMadeByHtml = new WeakSet<ISafeHtml>();
