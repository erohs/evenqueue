import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderStatusFormPage } from "#web/views/functions/renderStatusFormPage.function.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";

export const showStatusFormPage: DropRouteHandler = async ({ services, dropId }) => {
    const found = await findDropWithWaitlist(services, dropId);
    if (found === null) return commonResponses.notFound();
    return pageResponse(renderStatusFormPage({ dropId, waitlistLabel: found.waitlist.label, typed: "", error: null }));
};
