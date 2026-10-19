import type { IDrop } from "#domain/drops/interfaces/IDrop.ts";
import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlist } from "#domain/waitlist/interfaces/IWaitlist.ts";

/** Waitlists, drops and outages, each read back through its parser, so a corrupt row never reaches a use case. */
export interface IWaitlistStore {
    findWaitlist: (waitlistId: Bytes32Hex) => Promise<IWaitlist | null>;
    findDrop: (dropId: Bytes32Hex) => Promise<IDrop | null>;
    listServiceGaps: () => Promise<readonly IServiceGap[]>;
}
