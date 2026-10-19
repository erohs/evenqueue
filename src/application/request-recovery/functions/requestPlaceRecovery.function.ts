import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { checkSubmittedForm } from "#application/shared/form-checks/functions/checkSubmittedForm.function.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import { findPlaceByRecoveryCode } from "#application/shared/place-lookup/functions/findPlaceByRecoveryCode.function.ts";
import { buyerCodeByteLengths } from "#domain/credentials/consts/buyerCodeByteLengths.const.ts";
import { defaultRecoveryDelay } from "#domain/credentials/consts/defaultRecoveryDelay.const.ts";
import { issueBuyerCredentials } from "#domain/credentials/functions/issueBuyerCredentials.function.ts";
import { readTypedCode } from "#domain/credentials/functions/readTypedCode.function.ts";
import { requestRecovery } from "#domain/credentials/functions/requestRecovery.function.ts";
import { storedFormOfCredentials } from "#domain/credentials/functions/storedFormOfCredentials.function.ts";
import type { IRequestRecoveryRequest } from "../interfaces/IRequestRecoveryRequest.ts";
import type { RequestRecoveryOutcome } from "../types/RequestRecoveryOutcome.type.ts";

/**
 * New codes for the same place, working only after the delay; until then the old entry code can cancel. The next
 * checkpoint is not known before draw times are stored, so the delay alone sets the time for now.
 */
export const requestPlaceRecovery = async (
    services: Pick<IApplicationServices, "waitlists" | "places" | "clock" | "keys">,
    request: IRequestRecoveryRequest,
): Promise<RequestRecoveryOutcome> => {
    const found = await findDropWithWaitlist(services, request.dropId);
    if (found === null) return { kind: "drop-not-found" };
    const waitlistId = found.waitlist.waitlistId;
    const form = await checkSubmittedForm(services, "request-recovery", waitlistId, request);
    if (!form.isAccepted) return { kind: "confirm-again", reason: form.reason, ...found };
    const typed = request.typedRecoveryCode;
    const code = typeof typed === "string" ? readTypedCode(typed, buyerCodeByteLengths.recoveryCode) : null;
    const record = code === null ? null : await findPlaceByRecoveryCode(services, waitlistId, code);
    if (record === null) return { kind: "code-not-recognised" };
    const codes = await issueBuyerCredentials(services.keys.entryCodesKey, form.nonce);
    const replacement = await storedFormOfCredentials(codes, await services.keys.waitlistKey(waitlistId));
    const now = services.clock.now();
    const credentials = requestRecovery(record.credentials, replacement, now, defaultRecoveryDelay, null);
    await services.places.saveCredentials(waitlistId, record.place.placeId, credentials);
    const takesEffectAt = credentials.pendingRecovery?.takesEffectAt ?? now;
    return { kind: "recovery-requested", codes, takesEffectAt, ...found };
};
