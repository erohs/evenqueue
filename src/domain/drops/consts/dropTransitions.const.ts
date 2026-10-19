import type { IDropTransition } from "../interfaces/IDropTransition.ts";
import type { DropEvent } from "../types/DropEvent.type.ts";

/**
 * A drop can be cancelled only before its commitment is published: after that, stopping it would let the vendor
 * discard an order they did not like. A void keeps the drop committed, with the same waitlist root and a later round.
 */
export const dropTransitions: Readonly<Record<DropEvent, IDropTransition>> = {
    "drop-opened": { from: ["draft"], to: "open" },
    "entry-closed": { from: ["open"], to: "closed" },
    "commitment-published": { from: ["closed"], to: "committed" },
    "draw-voided": { from: ["committed"], to: "committed" },
    "beacon-round-arrived": { from: ["committed"], to: "drawing" },
    "draw-order-finished": { from: ["drawing"], to: "offering" },
    "offers-finished": { from: ["offering"], to: "finished" },
    "drop-cancelled": { from: ["draft", "open", "closed"], to: "cancelled" },
};
