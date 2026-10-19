import { showDrop } from "#application/show-drop/functions/showDrop.function.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderDropPage } from "#web/views/functions/renderDropPage.function.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";

/** The one page a vendor may show inside a frame on their own site. */
export const showDropPage: DropRouteHandler = async ({ services, dropId }) => {
    const shown = await showDrop(services, dropId);
    if (shown.kind === "drop-not-found") return commonResponses.notFound();
    return pageResponse(renderDropPage(shown), { embedOrigins: shown.drop.settings.embedOrigins });
};
