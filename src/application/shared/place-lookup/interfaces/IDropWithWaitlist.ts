import type { IDrop } from "#domain/drops/interfaces/IDrop.ts";
import type { IWaitlist } from "#domain/waitlist/interfaces/IWaitlist.ts";

export interface IDropWithWaitlist {
    readonly drop: IDrop;
    readonly waitlist: IWaitlist;
}
