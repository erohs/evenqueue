import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { IDrop } from "#domain/drops/interfaces/IDrop.ts";

export interface IDevelopmentSetup {
    readonly services: IApplicationServices;
    readonly drop: IDrop;
}
