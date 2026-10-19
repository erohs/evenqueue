import { toBytes32Hex } from "#domain/shared/bytes/functions/toBytes32Hex.function.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";
import { dropPathPattern } from "../consts/dropPathPattern.const.ts";
import { dropRoutes } from "../consts/dropRoutes.const.ts";
import type { IDropRoute } from "../interfaces/IDropRoute.ts";
import type { IWebContext } from "../interfaces/IWebContext.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { messageResponse } from "./messageResponse.function.ts";

const handlerFor = (route: IDropRoute, method: string): DropRouteHandler | undefined =>
    method === "GET" ? route.onGet : method === "POST" ? route.onPost : undefined;

/** The buyer pages as one web-standard handler, so any host that speaks Request and Response can serve them. */
export const handleBuyerRequest = async (request: Request, context: IWebContext): Promise<Response> => {
    const [, dropIdText, path = ""] = dropPathPattern.exec(new URL(request.url).pathname) ?? [];
    const route = dropRoutes.find((candidate) => candidate.path === path);
    if (dropIdText === undefined || route === undefined) return commonResponses.notFound();
    const dropId = toBytes32Hex(dropIdText);
    const handler = handlerFor(route, request.method);
    if (handler !== undefined) return handler({ ...context, request, dropId });
    const allowedMethods = ["GET", "POST"].filter((method) => handlerFor(route, method) !== undefined);
    return messageResponse("This page can't do that", "Please use the links and buttons on the page.", dropId, {
        status: 405,
        allowedMethods,
    });
};
