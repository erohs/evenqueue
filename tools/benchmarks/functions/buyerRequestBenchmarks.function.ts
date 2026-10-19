import { inclusionProofFromLevels } from "#domain/commitment/functions/inclusionProofFromLevels.function.ts";
import { readTypedCode } from "#domain/credentials/functions/readTypedCode.function.ts";
import { readTypedPhrase } from "#domain/credentials/functions/readTypedPhrase.function.ts";
import type { IBenchmark } from "../interfaces/IBenchmark.ts";
import type { IBenchmarkFixtures } from "../interfaces/IBenchmarkFixtures.ts";
import { codesPageBenchmarks } from "./codesPageBenchmarks.function.ts";
import { joinBenchmarks } from "./joinBenchmarks.function.ts";

/** Work done while a buyer waits, which must fit the 10 ms CPU budget of a Workers Free request. */
export const buyerRequestBenchmarks = (fixtures: IBenchmarkFixtures): IBenchmark[] => [
    ...joinBenchmarks(fixtures),
    ...codesPageBenchmarks(fixtures),
    {
        name: "status: read a typed code",
        runsOn: "buyer request",
        runs: 2_000,
        operation: () => readTypedCode("xwth-sdvs-eyxv-2rr3-vw53-rrky-h4", 16),
    },
    {
        name: "status: read a typed phrase",
        runsOn: "buyer request",
        runs: 2_000,
        operation: () => readTypedPhrase("slather serotonin unwilling purebred scrunch ocelot purely"),
    },
    {
        name: "status: one proof from stored levels, 50,000 places",
        runsOn: "buyer request",
        runs: 2_000,
        operation: () => inclusionProofFromLevels(fixtures.tree50k.levels, 31_337),
    },
];
