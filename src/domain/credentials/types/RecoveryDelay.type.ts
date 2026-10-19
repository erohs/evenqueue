import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

/** A duration of at least six hours, so the old code's holder can cancel. Made only by toRecoveryDelay. */
export type RecoveryDelay = DurationMilliseconds & { readonly isLongEnoughToCancel: true };
