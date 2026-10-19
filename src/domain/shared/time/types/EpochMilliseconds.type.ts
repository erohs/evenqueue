/**
 * A UTC instant in whole milliseconds since the Unix epoch, within the range a JavaScript Date can hold. Made only by
 * toEpochMilliseconds or the arithmetic in shared/time, so NaN, infinities and fractions never reach the engine.
 */
export type EpochMilliseconds = number & { readonly brand: "EpochMilliseconds" };
