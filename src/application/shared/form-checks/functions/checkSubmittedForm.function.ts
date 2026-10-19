import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { readFormToken } from "#domain/form-guard/functions/readFormToken.function.ts";
import type { FormPurpose } from "#domain/form-guard/types/FormPurpose.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { ISubmittedForm } from "../interfaces/ISubmittedForm.ts";
import type { FormCheck } from "../types/FormCheck.type.ts";

/** A plain form posted from a vendor's own site has no token, so it lands here too and gets a confirm step. */
export const checkSubmittedForm = async (
    services: Pick<IApplicationServices, "keys" | "clock">,
    purpose: FormPurpose,
    waitlistId: Bytes32Hex,
    form: ISubmittedForm,
): Promise<FormCheck> => {
    if (form.honeypot !== undefined && form.honeypot !== "") return { isAccepted: false, reason: "honeypot-filled" };
    const now = services.clock.now();
    const reading = await readFormToken(services.keys.formGuardKey, purpose, waitlistId, form.formToken, now);
    if (reading.kind !== "accepted") return { isAccepted: false, reason: reading.kind };
    return { isAccepted: true, nonce: reading.nonce };
};
