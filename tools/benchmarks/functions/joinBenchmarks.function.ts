import { deriveServerKey } from "#domain/credentials/functions/deriveServerKey.function.ts";
import { readFormToken } from "#domain/form-guard/functions/readFormToken.function.ts";
import type { IBenchmark } from "../interfaces/IBenchmark.ts";
import type { IBenchmarkFixtures } from "../interfaces/IBenchmarkFixtures.ts";

/** The form check and key derivation in one join; with issuing the codes they must fit the 10 ms CPU budget of a Workers Free request. */
export const joinBenchmarks = (fixtures: IBenchmarkFixtures): IBenchmark[] => [
    {
        name: "join: read the signed form token",
        runsOn: "buyer request",
        runs: 500,
        operation: () =>
            readFormToken(
                fixtures.entryKey,
                "join-waitlist",
                fixtures.waitlistId,
                fixtures.formToken,
                fixtures.formSentAt,
            ),
    },
    {
        name: "join: derive the waitlist key",
        runsOn: "buyer request",
        runs: 500,
        operation: () => deriveServerKey(fixtures.entryKey, "waitlist", fixtures.entryKey),
    },
];
