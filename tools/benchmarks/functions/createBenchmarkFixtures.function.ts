import { createHash, randomBytes } from "node:crypto";
import { toPriority } from "#domain/allocation-rules/functions/toPriority.function.ts";
import { buildMerkleTree } from "#domain/commitment/functions/buildMerkleTree.function.ts";
import { hashWaitlistLeaf } from "#domain/commitment/functions/hashWaitlistLeaf.function.ts";
import { sortLeavesForCommitment } from "#domain/commitment/functions/sortLeavesForCommitment.function.ts";
import { toServerKey } from "#domain/credentials/functions/toServerKey.function.ts";
import { appendLogEntry } from "#domain/public-log/functions/appendLogEntry.function.ts";
import type { IPublicLogEntry } from "#domain/public-log/interfaces/IPublicLogEntry.ts";
import { toBytes32Hex } from "#domain/shared/bytes/functions/toBytes32Hex.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import type { IBenchmarkFixtures } from "../interfaces/IBenchmarkFixtures.ts";

const hex = (label: string) => toBytes32Hex(createHash("sha256").update(label).digest("hex"));
const leavesOf = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ publicDrawId: hex(`leaf-${i}`), priority: toPriority(i % 3) }));
const logOf = async (count: number): Promise<IPublicLogEntry[]> => {
    const log: IPublicLogEntry[] = [];
    for (let i = 0; i < count; i++) {
        log.push(await appendLogEntry(log.at(-1) ?? null, "unit-counts", { sold: i }, toEpochMilliseconds(i)));
    }
    return log;
};

export const createBenchmarkFixtures = async (): Promise<IBenchmarkFixtures> => {
    const leaves50k = leavesOf(50_000);
    return {
        entryKey: toServerKey(new Uint8Array(randomBytes(32))),
        seriesKey: toServerKey(new Uint8Array(randomBytes(32))),
        leaves10k: leavesOf(10_180),
        leaves50k,
        tree50k: await buildMerkleTree(await Promise.all(sortLeavesForCommitment(leaves50k).map(hashWaitlistLeaf))),
        drawInputs: { beaconRandomness: hex("beacon"), committedWaitlistRoot: hex("root") },
        log1k: await logOf(1_000),
    };
};
