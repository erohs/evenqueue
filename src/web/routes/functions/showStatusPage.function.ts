import { checkStatus } from "#application/check-status/functions/checkStatus.function.ts";
import { formField } from "#web/http/functions/formField.function.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderStatusPage } from "#web/views/functions/renderStatusPage.function.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { codeNotRecognisedResponse } from "./codeNotRecognisedResponse.function.ts";
import { readLimitedForm } from "./readLimitedForm.function.ts";

export const showStatusPage: DropRouteHandler = async (dropRequest) => {
    const { services, dropId } = dropRequest;
    const fields = await readLimitedForm(dropRequest, "code-lookup");
    if (fields instanceof Response) return fields;
    const typedCode = formField(fields, "code") ?? "";
    const status = await checkStatus(services, { dropId, typedCode });
    if (status.kind === "drop-not-found") return commonResponses.notFound();
    if (status.kind === "code-not-recognised") return codeNotRecognisedResponse(services, dropId, typedCode);
    return pageResponse(renderStatusPage(status, typedCode));
};
