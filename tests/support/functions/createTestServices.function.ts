import assert from "node:assert/strict";
import { createInMemoryKeyStore } from "#adapters/in-memory/functions/createInMemoryKeyStore.function.ts";
import { createInMemoryRateLimiter } from "#adapters/in-memory/functions/createInMemoryRateLimiter.function.ts";
import { createInMemoryPlaceStore } from "#adapters/in-memory/functions/createInMemoryPlaceStore.function.ts";
import { createInMemoryWaitlistStore } from "#adapters/in-memory/functions/createInMemoryWaitlistStore.function.ts";
import { createWaitlistKeySalt } from "#application/instance-keys/functions/createWaitlistKeySalt.function.ts";
import { loadInstanceKeys } from "#application/instance-keys/functions/loadInstanceKeys.function.ts";
import type { IDropSettings } from "#domain/drops/interfaces/IDropSettings.ts";
import type { ITestServices } from "../interfaces/ITestServices.ts";
import { createSeededRandomSource } from "./createSeededRandomSource.function.ts";
import { createSettableClock } from "./createSettableClock.function.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";
import { dropForTests } from "./dropForTests.function.ts";
import { waitlistForTests } from "./waitlistForTests.function.ts";

/** Every service in memory, around one waitlist with an open drop and a draft drop. */
export const createTestServices = async (settings: Partial<IDropSettings> = {}): Promise<ITestServices> => {
    const opened = dropForTests("open");
    const openDrop = { ...opened, settings: { ...opened.settings, ...settings } };
    const draftDrop = { ...dropForTests("draft"), dropId: deterministicBytes32Hex("draft drop") };
    const waitlist = waitlistForTests();
    const keyStore = createInMemoryKeyStore();
    const random = createSeededRandomSource(5);
    await createWaitlistKeySalt(keyStore, random, waitlist.waitlistId);
    const clock = createSettableClock(opened.openedAt ?? assert.fail("an open drop has an opening time"));
    return {
        waitlists: createInMemoryWaitlistStore({
            waitlists: [waitlist],
            drops: [openDrop, draftDrop],
            serviceGaps: [],
        }),
        places: createInMemoryPlaceStore(),
        clock,
        rateLimiter: createInMemoryRateLimiter(clock),
        random,
        keys: await loadInstanceKeys(keyStore, random),
        openDrop,
        draftDrop,
    };
};
