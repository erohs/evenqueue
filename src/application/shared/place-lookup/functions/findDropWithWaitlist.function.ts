import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { settingsInForceAt } from "#domain/drops/functions/settingsInForceAt.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IDropWithWaitlist } from "../interfaces/IDropWithWaitlist.ts";

/** A drop with any settings notice that has run out applied, and its waitlist; null if either is missing. */
export const findDropWithWaitlist = async (
    services: Pick<IApplicationServices, "waitlists" | "clock">,
    dropId: Bytes32Hex,
): Promise<IDropWithWaitlist | null> => {
    const drop = await services.waitlists.findDrop(dropId);
    if (drop === null) return null;
    const waitlist = await services.waitlists.findWaitlist(drop.waitlistId);
    return waitlist === null ? null : { drop: settingsInForceAt(drop, services.clock.now()), waitlist };
};
