import { buildInclusionProof } from "#domain/commitment/functions/buildInclusionProof.function.ts";
import { computeWaitlistRoot } from "#domain/commitment/functions/computeWaitlistRoot.function.ts";
import { orderLeavesForDraw } from "#domain/draw/functions/orderLeavesForDraw.function.ts";
import { findLogProblems } from "#domain/public-log/functions/findLogProblems.function.ts";
import type { IBenchmark } from "../interfaces/IBenchmark.ts";
import type { IBenchmarkFixtures } from "../interfaces/IBenchmarkFixtures.ts";

const benchmark = (name: string, runsOn: IBenchmark["runsOn"], runs: number, operation: () => unknown): IBenchmark => ({
    name,
    runsOn,
    runs,
    operation,
});

/** Work done in the sliced close pipeline or by the verifier, which no buyer waits on. */
export const backgroundBenchmarks = (fixtures: IBenchmarkFixtures): IBenchmark[] => {
    const { leaves10k, leaves50k, drawInputs, log1k } = fixtures;
    const someLeaf = leaves10k[77] ?? leaves10k[0];
    return [
        benchmark("close: waitlist root, 10,180 places", "close pipeline", 5, () => computeWaitlistRoot(leaves10k)),
        benchmark("close: waitlist root, 50,000 places", "close pipeline", 3, () => computeWaitlistRoot(leaves50k)),
        benchmark("draw: order 10,180 leaves", "close pipeline", 5, () => orderLeavesForDraw(leaves10k, drawInputs)),
        benchmark("verify: rebuild the tree for one proof, 10,180 places", "verifier", 5, () =>
            someLeaf === undefined ? null : buildInclusionProof(leaves10k, someLeaf.publicDrawId),
        ),
        benchmark("verify: replay a 1,000-entry log", "verifier", 5, () => findLogProblems(log1k)),
    ];
};
