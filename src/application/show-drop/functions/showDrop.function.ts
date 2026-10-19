import { issueFormToken } from "#application/issue-form-token/functions/issueFormToken.function.ts";
import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import { entryWindowCloseOf } from "#domain/drops/functions/entryWindowCloseOf.function.ts";
import { isDropOpenForEntry } from "#domain/drops/functions/isDropOpenForEntry.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { ShowDropOutcome } from "../types/ShowDropOutcome.type.ts";

export const showDrop = async (
    services: Pick<IApplicationServices, "waitlists" | "clock" | "keys" | "random">,
    dropId: Bytes32Hex,
): Promise<ShowDropOutcome> => {
    const found = await findDropWithWaitlist(services, dropId);
    if (found === null) return { kind: "drop-not-found" };
    const gaps = await services.waitlists.listServiceGaps();
    const isOpenForEntry = isDropOpenForEntry(found.drop, gaps, services.clock.now());
    const joinFormToken = isOpenForEntry
        ? await issueFormToken(services, "join-waitlist", found.waitlist.waitlistId)
        : null;
    return {
        kind: "drop",
        ...found,
        isOpenForEntry,
        entryClosesAt: entryWindowCloseOf(found.drop, gaps),
        joinFormToken,
    };
};
