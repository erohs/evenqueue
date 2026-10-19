import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import type { ICommitmentInput } from "#domain/commitment/interfaces/ICommitmentInput.ts";
import vectors from "#tests/vectors/waitlistCommitment.json" with { type: "json" };
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

/** The shared vector leaves, committed six hours before quicknet round 1,000,000. */
export const commitmentInputForTests = (overrides: Partial<ICommitmentInput> = {}): ICommitmentInput => ({
    drawId: vectors.drawId,
    leaves: vectors.leaves,
    settingsDigest: deterministicBytes32Hex("settings"),
    committedAt: beaconRoundTime(1_000_000) - 6 * 3_600_000,
    beaconRound: 1_000_000,
    ...overrides,
});
