import type { IDrop } from "#domain/drops/interfaces/IDrop.ts";
import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import type { IWaitlist } from "#domain/waitlist/interfaces/IWaitlist.ts";

export interface IInMemoryWaitlistContents {
    readonly waitlists: readonly IWaitlist[];
    readonly drops: readonly IDrop[];
    readonly serviceGaps: readonly IServiceGap[];
}
