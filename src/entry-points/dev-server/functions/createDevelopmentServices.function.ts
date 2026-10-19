import { createInMemoryKeyStore } from "#adapters/in-memory/functions/createInMemoryKeyStore.function.ts";
import { createInMemoryPlaceStore } from "#adapters/in-memory/functions/createInMemoryPlaceStore.function.ts";
import { createInMemoryRateLimiter } from "#adapters/in-memory/functions/createInMemoryRateLimiter.function.ts";
import { createInMemoryWaitlistStore } from "#adapters/in-memory/functions/createInMemoryWaitlistStore.function.ts";
import { createSystemClock } from "#adapters/web-platform/functions/createSystemClock.function.ts";
import { createWebCryptoRandomSource } from "#adapters/web-platform/functions/createWebCryptoRandomSource.function.ts";
import { createWaitlistKeySalt } from "#application/instance-keys/functions/createWaitlistKeySalt.function.ts";
import { loadInstanceKeys } from "#application/instance-keys/functions/loadInstanceKeys.function.ts";
import { developmentWaitlist } from "../consts/developmentWaitlist.const.ts";
import type { IDevelopmentSetup } from "../interfaces/IDevelopmentSetup.ts";
import { developmentDrop } from "./developmentDrop.function.ts";

/** One demo waitlist with a drop that opened when the server started, all in memory and gone on restart. */
export const createDevelopmentServices = async (): Promise<IDevelopmentSetup> => {
    const clock = createSystemClock();
    const random = createWebCryptoRandomSource();
    const drop = developmentDrop(clock.now());
    const keyStore = createInMemoryKeyStore();
    await createWaitlistKeySalt(keyStore, random, developmentWaitlist.waitlistId);
    const services = {
        waitlists: createInMemoryWaitlistStore({ waitlists: [developmentWaitlist], drops: [drop], serviceGaps: [] }),
        places: createInMemoryPlaceStore(),
        clock,
        random,
        keys: await loadInstanceKeys(keyStore, random),
        rateLimiter: createInMemoryRateLimiter(clock),
    };
    return { services, drop };
};
