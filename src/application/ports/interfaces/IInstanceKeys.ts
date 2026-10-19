import type { ServerKey } from "#domain/credentials/types/ServerKey.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** The keys use cases need, all derived from the instance's root key. */
export interface IInstanceKeys {
    readonly entryCodesKey: ServerKey;
    readonly formGuardKey: ServerKey;
    /** Throws if the waitlist has no salt, which only a missing key backup can cause. */
    waitlistKey: (waitlistId: Bytes32Hex) => Promise<ServerKey>;
}
