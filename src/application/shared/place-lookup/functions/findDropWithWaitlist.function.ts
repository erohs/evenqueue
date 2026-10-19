import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { settingsInForceAt } from "#domain/drops/functions/settingsInForceAt.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IDropWithWaitlist } from "../interfaces/IDropWithWaitlist.ts";

/**
 * A public drop, with any settings notice that has run out applied, and its waitlist. Null if either is missing or
 * the drop is still a draft, which buyers never see.
 */
export const findDropWithWaitlist = async (
    services: Pick<IApplicationServices, "waitlists" | "clock">,
    dropId: Bytes32Hex,
): Promise<IDropWithWaitlist | null> => {
    const drop = await services.waitlists.findDrop(dropId);
    if (drop === null || drop.state === "draft") return null;
    const waitlist = await services.waitlists.findWaitlist(drop.waitlistId);
    return waitlist === null ? null : { drop: settingsInForceAt(drop, services.clock.now()), waitlist };
};
