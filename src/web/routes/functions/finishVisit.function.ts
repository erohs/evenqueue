import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { messageResponse } from "./messageResponse.function.ts";

/** Clears the browser's cached pages, so going back cannot show codes again on a shared device. */
export const finishVisit: DropRouteHandler = async ({ dropId }) =>
    messageResponse(
        "All done",
        "This browser has been asked to forget the pages it kept from this visit. You can close this tab.",
        dropId,
        { shouldClearCache: true },
    );
