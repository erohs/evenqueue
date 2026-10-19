import { joinWaitlist } from "#application/join-waitlist/functions/joinWaitlist.function.ts";
import { formField } from "#web/http/functions/formField.function.ts";
import { honeypotFieldName } from "#web/views/consts/honeypotFieldName.const.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";
import { joinRefusalMessages } from "../consts/joinRefusalMessages.const.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { confirmJoinResponse } from "./confirmJoinResponse.function.ts";
import { joinedResponse } from "./joinedResponse.function.ts";
import { messageResponse } from "./messageResponse.function.ts";
import { readLimitedForm } from "./readLimitedForm.function.ts";

export const enterWaitlist: DropRouteHandler = async (dropRequest) => {
    const { services, dropId } = dropRequest;
    const fields = await readLimitedForm(dropRequest, "joining");
    if (fields instanceof Response) return fields;
    const formToken = formField(fields, "formToken");
    const outcome = await joinWaitlist(services, { dropId, formToken, honeypot: formField(fields, honeypotFieldName) });
    if (outcome.kind === "joined") return joinedResponse(outcome);
    if (outcome.kind === "confirm-again") return confirmJoinResponse(services, outcome);
    if (outcome.kind === "drop-not-found") return commonResponses.notFound();
    const { heading, message } = joinRefusalMessages[outcome.kind];
    return messageResponse(heading, message, dropId, { status: 409 });
};
