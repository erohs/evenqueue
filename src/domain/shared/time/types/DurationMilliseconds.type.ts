/** A positive length of time in whole milliseconds, at most a century. Made only by toDurationMilliseconds. */
export type DurationMilliseconds = number & { readonly brand: "DurationMilliseconds" };
