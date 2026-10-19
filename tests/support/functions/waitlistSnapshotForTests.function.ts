import type { IWaitlistSnapshot } from "#domain/continuity/interfaces/IWaitlistSnapshot.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";
import { publicLogEntriesFromVectors } from "./publicLogEntriesFromVectors.function.ts";
import { storedCredentialsForTests } from "./storedCredentialsForTests.function.ts";

const pendingRecovery = (name: string) => ({
    requestedAt: toEpochMilliseconds(1),
    takesEffectAt: toEpochMilliseconds(2),
    replacement: storedCredentialsForTests(`${name}/recovered`),
});

/** A valid snapshot of three places, one of them part-way through a recovery, with the shared vector log. */
export const waitlistSnapshotForTests = (): IWaitlistSnapshot => ({
    formatVersion: 1,
    allocationRuleId: "priority-after-losses",
    exportedAt: toEpochMilliseconds(1_760_000_100_000),
    places: ["first", "second", "third"].map((name, i) => ({
        place: {
            ...createWaitlistPlace(deterministicBytes32Hex(`place/${name}`), toCount(0)),
            drawsEntered: toCount(i),
        },
        credentials: {
            current: storedCredentialsForTests(name),
            pendingRecovery: i === 2 ? pendingRecovery(name) : null,
        },
    })),
    publicLog: publicLogEntriesFromVectors(),
});
