import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { handleBuyerRequest } from "#web/routes/functions/handleBuyerRequest.function.ts";
import type { IPageVisit } from "../interfaces/IPageVisit.ts";

/** Sends one request the way a browser with JavaScript off would: a plain GET, or a POST of form fields. */
export const visitPage = async (
    services: IApplicationServices,
    method: "GET" | "POST" | "PUT",
    path: string,
    fields: Readonly<Record<string, string>> = {},
): Promise<IPageVisit> => {
    const isPost = method === "POST";
    const request = new Request(`http://localhost${path}`, {
        method,
        ...(isPost ? { headers: { "content-type": "application/x-www-form-urlencoded" } } : {}),
        ...(isPost ? { body: new URLSearchParams(fields).toString() } : {}),
    });
    const response = await handleBuyerRequest(request, { services, clientAddress: "192.0.2.10" });
    return { status: response.status, headers: response.headers, body: await response.text() };
};
