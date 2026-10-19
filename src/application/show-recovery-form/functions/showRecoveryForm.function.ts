import { issueFormToken } from "#application/issue-form-token/functions/issueFormToken.function.ts";
import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { ShowRecoveryFormOutcome } from "../types/ShowRecoveryFormOutcome.type.ts";

export const showRecoveryForm = async (
    services: Pick<IApplicationServices, "waitlists" | "clock" | "keys" | "random">,
    dropId: Bytes32Hex,
): Promise<ShowRecoveryFormOutcome> => {
    const found = await findDropWithWaitlist(services, dropId);
    if (found === null) return { kind: "drop-not-found" };
    const formToken = await issueFormToken(services, "request-recovery", found.waitlist.waitlistId);
    return { kind: "form", formToken, ...found };
};
