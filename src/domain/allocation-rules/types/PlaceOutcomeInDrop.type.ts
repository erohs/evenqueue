/**
 * bought: the place leaves the waitlist; not-offered: the buyer missed out; offer-not-taken: the buyer let an offer
 * lapse; offer-withdrawn: the vendor withdrew the offer or could not honour it (payments down, a long outage), which
 * counts as not offered so the buyer is never penalised for the vendor's failure.
 */
export type PlaceOutcomeInDrop = "bought" | "not-offered" | "offer-not-taken" | "offer-withdrawn";
