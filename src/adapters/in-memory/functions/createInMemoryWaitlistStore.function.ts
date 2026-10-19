import type { IWaitlistStore } from "#application/ports/interfaces/IWaitlistStore.ts";
import type { IInMemoryWaitlistContents } from "../interfaces/IInMemoryWaitlistContents.ts";

/** For tests and local runs, holding fixed contents. */
export const createInMemoryWaitlistStore = (contents: IInMemoryWaitlistContents): IWaitlistStore => ({
    findWaitlist: async (waitlistId) =>
        contents.waitlists.find((waitlist) => waitlist.waitlistId === waitlistId) ?? null,
    findDrop: async (dropId) => contents.drops.find((drop) => drop.dropId === dropId) ?? null,
    listServiceGaps: async () => contents.serviceGaps,
});
