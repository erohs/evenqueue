import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";

export interface IWebContext {
    readonly services: IApplicationServices;
    /** As the platform reports it, never from a header the client controls. */
    readonly clientAddress: string;
}
