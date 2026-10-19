import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import { toBeaconRound } from "#domain/beacon/functions/toBeaconRound.function.ts";
import type { ICommitmentInput } from "#domain/commitment/interfaces/ICommitmentInput.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";
import { waitlistCommitmentVectors } from "./waitlistCommitmentVectors.function.ts";

const roundOneMillion = toBeaconRound(1_000_000);

/** The shared vector leaves, committed six hours before quicknet round 1,000,000. */
export const commitmentInputForTests = (overrides: Partial<ICommitmentInput> = {}): ICommitmentInput => {
    const vectors = waitlistCommitmentVectors();
    return {
        drawId: vectors.drawId,
        leaves: vectors.leaves,
        settingsDigest: deterministicBytes32Hex("settings"),
        committedAt: toEpochMilliseconds(beaconRoundTime(roundOneMillion) - 6 * 3_600_000),
        beaconRound: roundOneMillion,
        ...overrides,
    };
};
