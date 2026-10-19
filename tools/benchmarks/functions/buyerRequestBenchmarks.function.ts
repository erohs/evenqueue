import { randomBytes } from "node:crypto";
import { inclusionProofFromLevels } from "#domain/commitment/functions/inclusionProofFromLevels.function.ts";
import { issueBuyerCredentials } from "#domain/credentials/functions/issueBuyerCredentials.function.ts";
import { readTypedCode } from "#domain/credentials/functions/readTypedCode.function.ts";
import { storedFormOfCredentials } from "#domain/credentials/functions/storedFormOfCredentials.function.ts";
import { toFormNonce } from "#domain/credentials/functions/toFormNonce.function.ts";
import type { IBenchmark } from "../interfaces/IBenchmark.ts";
import type { IBenchmarkFixtures } from "../interfaces/IBenchmarkFixtures.ts";

/** Work done while a buyer waits, which must fit the 10 ms CPU budget of a Workers Free request. */
export const buyerRequestBenchmarks = (fixtures: IBenchmarkFixtures): IBenchmark[] => [
    {
        name: "join: issue codes and their stored form",
        runsOn: "buyer request",
        runs: 200,
        operation: async () =>
            storedFormOfCredentials(
                await issueBuyerCredentials(fixtures.entryKey, toFormNonce(new Uint8Array(randomBytes(16)))),
                fixtures.seriesKey,
            ),
    },
    {
        name: "status: read a typed code",
        runsOn: "buyer request",
        runs: 2_000,
        operation: () => readTypedCode("xwth-sdvs-eyxv-2rr3-vw53-rrky-h4", 16),
    },
    {
        name: "status: one proof from stored levels, 50,000 places",
        runsOn: "buyer request",
        runs: 2_000,
        operation: () => inclusionProofFromLevels(fixtures.tree50k.levels, 31_337),
    },
];
