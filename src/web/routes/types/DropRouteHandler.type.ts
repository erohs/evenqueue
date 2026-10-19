import type { IDropRequest } from "../interfaces/IDropRequest.ts";

export type DropRouteHandler = (dropRequest: IDropRequest) => Promise<Response>;
