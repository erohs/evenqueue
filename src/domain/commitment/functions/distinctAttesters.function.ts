import { normaliseIdentifier } from "#domain/shared/text/functions/normaliseIdentifier.function.ts";

/**
 * Names in one spelling each, so one party cannot count twice by spelling its name differently. Names are only
 * self-reported here; the public verifier checks each attester's signature.
 */
export const distinctAttesters = (attestedBy: readonly string[]): string[] => [
    ...new Set(attestedBy.map(normaliseIdentifier).filter((name) => name.length > 0)),
];
