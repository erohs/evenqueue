import { requestPlaceRecovery } from "#application/request-recovery/functions/requestPlaceRecovery.function.ts";
import { formField } from "#web/http/functions/formField.function.ts";
import { honeypotFieldName } from "#web/views/consts/honeypotFieldName.const.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { readLimitedForm } from "./readLimitedForm.function.ts";
import { recoveryFormResponse } from "./recoveryFormResponse.function.ts";
import { recoveryRequestedResponse } from "./recoveryRequestedResponse.function.ts";

export const requestNewCodes: DropRouteHandler = async (dropRequest) => {
    const { services, dropId } = dropRequest;
    const fields = await readLimitedForm(dropRequest, "code-lookup");
    if (fields instanceof Response) return fields;
    const typed = formField(fields, "recoveryCode") ?? "";
    const outcome = await requestPlaceRecovery(services, {
        dropId,
        formToken: formField(fields, "formToken"),
        honeypot: formField(fields, honeypotFieldName),
        typedRecoveryCode: typed,
    });
    if (outcome.kind === "recovery-requested") return recoveryRequestedResponse(outcome);
    if (outcome.kind === "confirm-again") {
        return recoveryFormResponse(services, dropId, { typed, error: null, shouldAskToConfirm: true });
    }
    if (outcome.kind === "drop-not-found") return commonResponses.notFound();
    const error = "That recovery code isn't recognised for this waitlist. Check it and try again.";
    return recoveryFormResponse(services, dropId, { typed, error, shouldAskToConfirm: false });
};
