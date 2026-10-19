/** The events that move a unit without a payment amount to check. Payment events arrive with redemption. */
export type UnitEvent =
    "offer-made" | "offer-claimed" | "offer-expired" | "claim-cancelled" | "payment-accepted" | "unit-withdrawn";
