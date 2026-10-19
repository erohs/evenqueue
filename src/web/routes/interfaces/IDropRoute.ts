import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";

export interface IDropRoute {
    /** After `/d/{dropId}`; empty for the drop page itself. */
    readonly path: string;
    readonly onGet?: DropRouteHandler;
    readonly onPost?: DropRouteHandler;
}
