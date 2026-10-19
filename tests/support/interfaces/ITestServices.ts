import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { IDrop } from "#domain/drops/interfaces/IDrop.ts";
import type { ISettableClock } from "./ISettableClock.ts";

export interface ITestServices extends IApplicationServices {
    readonly clock: ISettableClock;
    /** Open since the clock's start, with an entry window of 72 hours. */
    readonly openDrop: IDrop;
    /** A draft of the same waitlist, so not open for entry. */
    readonly draftDrop: IDrop;
}
