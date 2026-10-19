import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import { findPlaceByTypedCode } from "#application/shared/place-lookup/functions/findPlaceByTypedCode.function.ts";
import type { ITypedCodeRequest } from "#application/shared/place-lookup/interfaces/ITypedCodeRequest.ts";
import { entryWindowCloseOf } from "#domain/drops/functions/entryWindowCloseOf.function.ts";
import type { CheckStatusOutcome } from "../types/CheckStatusOutcome.type.ts";

/** Takes an entry code or a view key. */
export const checkStatus = async (
    services: Pick<IApplicationServices, "waitlists" | "places" | "clock" | "keys">,
    request: ITypedCodeRequest,
): Promise<CheckStatusOutcome> => {
    const found = await findDropWithWaitlist(services, request.dropId);
    if (found === null) return { kind: "drop-not-found" };
    const byCode = await findPlaceByTypedCode(services, found.waitlist.waitlistId, request.typedCode);
    if (byCode === null) return { kind: "code-not-recognised" };
    return {
        kind: "status",
        access: byCode.access,
        place: byCode.record.place,
        recoveryTakesEffectAt: byCode.record.credentials.pendingRecovery?.takesEffectAt ?? null,
        entryClosesAt: entryWindowCloseOf(found.drop, await services.waitlists.listServiceGaps()),
        ...found,
    };
};
