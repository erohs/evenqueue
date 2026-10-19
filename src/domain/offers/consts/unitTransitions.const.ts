import type { IUnitTransition } from "../interfaces/IUnitTransition.ts";
import type { UnitEvent } from "../types/UnitEvent.type.ts";

/** A sold unit is never clawed back, so no event here moves a unit out of `sold`. */
export const unitTransitions: Readonly<Record<UnitEvent, IUnitTransition>> = {
    "offer-made": { from: ["free"], to: "offered" },
    "offer-claimed": { from: ["offered"], to: "pending" },
    "offer-expired": { from: ["offered", "pending"], to: "free" },
    "claim-cancelled": { from: ["pending"], to: "free" },
    "payment-accepted": { from: ["pending"], to: "sold" },
    "unit-withdrawn": { from: ["free"], to: "withdrawn" },
};
