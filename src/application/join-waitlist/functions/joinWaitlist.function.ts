import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { checkSubmittedForm } from "#application/shared/form-checks/functions/checkSubmittedForm.function.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import { findPlaceByEntryCode } from "#application/shared/place-lookup/functions/findPlaceByEntryCode.function.ts";
import { issueBuyerCredentials } from "#domain/credentials/functions/issueBuyerCredentials.function.ts";
import { isDropOpenForEntry } from "#domain/drops/functions/isDropOpenForEntry.function.ts";
import type { IJoinWaitlistRequest } from "../interfaces/IJoinWaitlistRequest.ts";
import type { JoinWaitlistOutcome } from "../types/JoinWaitlistOutcome.type.ts";
import { newPlaceRecord } from "./newPlaceRecord.function.ts";

/** Adds one place with no personal data. Sending the same form again shows the same codes and adds nothing. */
export const joinWaitlist = async (
    services: Pick<IApplicationServices, "waitlists" | "places" | "clock" | "keys">,
    request: IJoinWaitlistRequest,
): Promise<JoinWaitlistOutcome> => {
    const found = await findDropWithWaitlist(services, request.dropId);
    if (found === null) return { kind: "drop-not-found" };
    const gaps = await services.waitlists.listServiceGaps();
    if (!isDropOpenForEntry(found.drop, gaps, services.clock.now())) return { kind: "entry-closed", ...found };
    const waitlistId = found.waitlist.waitlistId;
    const form = await checkSubmittedForm(services, "join-waitlist", waitlistId, request);
    if (!form.isAccepted) return { kind: "confirm-again", reason: form.reason, ...found };
    const codes = await issueBuyerCredentials(services.keys.entryCodesKey, form.nonce);
    const record = await newPlaceRecord(services, found, form.nonce, codes);
    const addition = await services.places.addPlace(waitlistId, record, found.drop.settings.entrantCap);
    if (addition === "waitlist-full") return { kind: "waitlist-full" };
    const isStillInForce =
        addition === "added" || (await findPlaceByEntryCode(services, waitlistId, codes.entrySecret)) !== null;
    return isStillInForce ? { kind: "joined", codes, ...found } : { kind: "codes-already-replaced" };
};
