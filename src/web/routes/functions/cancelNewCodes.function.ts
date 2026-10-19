import { cancelPlaceRecovery } from "#application/cancel-recovery/functions/cancelPlaceRecovery.function.ts";
import { formField } from "#web/http/functions/formField.function.ts";
import { cancelRecoveryMessages } from "../consts/cancelRecoveryMessages.const.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { codeNotRecognisedResponse } from "./codeNotRecognisedResponse.function.ts";
import { messageResponse } from "./messageResponse.function.ts";
import { readLimitedForm } from "./readLimitedForm.function.ts";

export const cancelNewCodes: DropRouteHandler = async (dropRequest) => {
    const { services, dropId } = dropRequest;
    const fields = await readLimitedForm(dropRequest, "code-lookup");
    if (fields instanceof Response) return fields;
    const typedCode = formField(fields, "code") ?? "";
    const outcome = await cancelPlaceRecovery(services, { dropId, typedCode });
    if (outcome === "drop-not-found") return commonResponses.notFound();
    if (outcome === "code-not-recognised") return codeNotRecognisedResponse(services, dropId, typedCode);
    const { heading, message } = cancelRecoveryMessages[outcome];
    return messageResponse(heading, message, dropId, { status: outcome === "needs-entry-code" ? 403 : 200 });
};
