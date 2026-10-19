import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import { entryWindowCloseOf } from "#domain/drops/functions/entryWindowCloseOf.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { ShowScheduleOutcome } from "../types/ShowScheduleOutcome.type.ts";

export const showSchedule = async (
    services: Pick<IApplicationServices, "waitlists" | "clock">,
    dropId: Bytes32Hex,
): Promise<ShowScheduleOutcome> => {
    const found = await findDropWithWaitlist(services, dropId);
    if (found === null) return { kind: "drop-not-found" };
    const entryClosesAt = entryWindowCloseOf(found.drop, await services.waitlists.listServiceGaps());
    return { kind: "schedule", entryClosesAt, ...found };
};
