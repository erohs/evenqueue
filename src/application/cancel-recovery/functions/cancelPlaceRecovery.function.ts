import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import { findPlaceByTypedCode } from "#application/shared/place-lookup/functions/findPlaceByTypedCode.function.ts";
import type { ITypedCodeRequest } from "#application/shared/place-lookup/interfaces/ITypedCodeRequest.ts";
import { cancelRecovery } from "#domain/credentials/functions/cancelRecovery.function.ts";
import type { CancelRecoveryOutcome } from "../types/CancelRecoveryOutcome.type.ts";

export const cancelPlaceRecovery = async (
    services: Pick<IApplicationServices, "waitlists" | "places" | "clock" | "keys">,
    request: ITypedCodeRequest,
): Promise<CancelRecoveryOutcome> => {
    const found = await findDropWithWaitlist(services, request.dropId);
    if (found === null) return "drop-not-found";
    const byCode = await findPlaceByTypedCode(services, found.waitlist.waitlistId, request.typedCode);
    if (byCode === null) return "code-not-recognised";
    if (byCode.access !== "entry-code") return "needs-entry-code";
    const { place, credentials } = byCode.record;
    if (credentials.pendingRecovery === null) return "nothing-to-cancel";
    await services.places.saveCredentials(found.waitlist.waitlistId, place.placeId, cancelRecovery(credentials));
    return "cancelled";
};
