import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { randomBytes } from "#tests/support/functions/randomBytes.function.ts";
import { randomWholeNumber } from "#tests/support/functions/randomWholeNumber.function.ts";
import { toPriority } from "#domain/allocation-rules/functions/toPriority.function.ts";
import { buildInclusionProof } from "#domain/commitment/functions/buildInclusionProof.function.ts";
import { computeWaitlistRoot } from "#domain/commitment/functions/computeWaitlistRoot.function.ts";
import { isLeafInWaitlistRoot } from "#domain/commitment/functions/isLeafInWaitlistRoot.function.ts";
import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { toBytes32Hex } from "#domain/shared/bytes/functions/toBytes32Hex.function.ts";

const random = createSeededRandom(2);
const randomLeaves = (count: number): IWaitlistLeaf[] =>
    Array.from({ length: count }, () => ({
        publicDrawId: toBytes32Hex(encodeHex(randomBytes(random, 32))),
        priority: toPriority(randomWholeNumber(random, -5, 2)),
    }));
const waitlists = Array.from({ length: 40 }, (_, i) => randomLeaves(i + 1));

const isEveryLeafProven = async (leaves: readonly IWaitlistLeaf[]): Promise<boolean> => {
    const root = await computeWaitlistRoot(leaves);
    for (const leaf of leaves) {
        const proof = (await buildInclusionProof(leaves, leaf.publicDrawId)) ?? [];
        if (!(await isLeafInWaitlistRoot(leaf, proof, root))) return false;
        if (await isLeafInWaitlistRoot({ ...leaf, priority: toPriority(leaf.priority + 1) }, proof, root)) return false;
    }
    return true;
};

describe("Using the waitlist commitment, for waitlists of 1 to 40 random places", () => {
    test("then every place should be provable, and no place with a changed priority", async () => {
        for (const leaves of waitlists) assert.ok(await isEveryLeafProven(leaves), `${leaves.length} places`);
    });

    test("then shuffling the places should never change the root", async () => {
        for (const leaves of waitlists) {
            assert.equal(
                await computeWaitlistRoot(leaves.toSorted(() => random() - 0.5)),
                await computeWaitlistRoot(leaves),
            );
        }
    });

    test("then removing any one place should always change the root", async () => {
        for (const leaves of waitlists.filter((candidate) => candidate.length > 1)) {
            const removed = leaves.toSpliced(randomWholeNumber(random, 0, leaves.length - 1), 1);
            assert.notEqual(await computeWaitlistRoot(removed), await computeWaitlistRoot(leaves));
        }
    });
});
