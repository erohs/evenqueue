import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";

/** Each freed unit is offered once more, to the next in line. */
export const defaultBackfillOffersPerUnit = toCount(1);
