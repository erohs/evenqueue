import { withdrawPlace } from "#application/withdraw-place/functions/withdrawPlace.function.ts";
import { formField } from "#web/http/functions/formField.function.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";
import { leaveMessages } from "../consts/leaveMessages.const.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { codeNotRecognisedResponse } from "./codeNotRecognisedResponse.function.ts";
import { leaveConfirmResponse } from "./leaveConfirmResponse.function.ts";
import { messageResponse } from "./messageResponse.function.ts";
import { readLimitedForm } from "./readLimitedForm.function.ts";

/** Asks once before deleting, because leaving cannot be undone. */
export const leaveWaitlist: DropRouteHandler = async (dropRequest) => {
    const { services, dropId } = dropRequest;
    const fields = await readLimitedForm(dropRequest, "code-lookup");
    if (fields instanceof Response) return fields;
    const typedCode = formField(fields, "code") ?? "";
    if (formField(fields, "confirm") !== "yes") return leaveConfirmResponse(services, dropId, typedCode);
    const outcome = await withdrawPlace(services, { dropId, typedCode });
    if (outcome === "drop-not-found") return commonResponses.notFound();
    if (outcome === "code-not-recognised") return codeNotRecognisedResponse(services, dropId, typedCode);
    const { heading, message } = leaveMessages[outcome];
    return messageResponse(heading, message, dropId, { status: outcome === "withdrawn" ? 200 : 403 });
};
