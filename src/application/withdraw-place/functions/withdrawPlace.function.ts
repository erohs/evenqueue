import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import { findPlaceByTypedCode } from "#application/shared/place-lookup/functions/findPlaceByTypedCode.function.ts";
import type { ITypedCodeRequest } from "#application/shared/place-lookup/interfaces/ITypedCodeRequest.ts";
import type { WithdrawPlaceOutcome } from "../types/WithdrawPlaceOutcome.type.ts";

/** One step, with the entry code only: the place is deleted, not marked. */
export const withdrawPlace = async (
    services: Pick<IApplicationServices, "waitlists" | "places" | "clock">,
    request: ITypedCodeRequest,
): Promise<WithdrawPlaceOutcome> => {
    const found = await findDropWithWaitlist(services, request.dropId);
    if (found === null) return "drop-not-found";
    const byCode = await findPlaceByTypedCode(services, found.waitlist.waitlistId, request.typedCode);
    if (byCode === null) return "code-not-recognised";
    if (byCode.access !== "entry-code") return "needs-entry-code";
    await services.places.removePlace(found.waitlist.waitlistId, byCode.record.place.placeId);
    return "withdrawn";
};
