import { randomBytes } from "node:crypto";
import { issueBuyerCredentials } from "#domain/credentials/functions/issueBuyerCredentials.function.ts";
import { storedFormOfCredentials } from "#domain/credentials/functions/storedFormOfCredentials.function.ts";
import { toFormNonce } from "#domain/credentials/functions/toFormNonce.function.ts";
import { renderQrCode } from "#web/views/functions/renderQrCode.function.ts";
import type { IBenchmark } from "../interfaces/IBenchmark.ts";
import type { IBenchmarkFixtures } from "../interfaces/IBenchmarkFixtures.ts";

const codeShown = "XWTH-SDVS-EYXV-2RR3-VW53-RRKY-H4";

/** Issuing the codes, phrase included, and drawing two QR codes for the codes page, each choosing among eight masks. */
export const codesPageBenchmarks = (fixtures: IBenchmarkFixtures): IBenchmark[] => [
    {
        name: "join: issue codes and their stored form",
        runsOn: "buyer request",
        runs: 200,
        operation: async () =>
            storedFormOfCredentials(
                await issueBuyerCredentials(fixtures.entryKey, toFormNonce(new Uint8Array(randomBytes(16)))),
                fixtures.waitlistKey,
            ),
    },
    {
        name: "join: two QR codes for the codes page",
        runsOn: "buyer request",
        runs: 200,
        operation: () => [renderQrCode(codeShown, "Entry code"), renderQrCode(codeShown, "View key")],
    },
];
