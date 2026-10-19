/**
 * A draw is voided only when this many parties independent of the vendor attest that the beacon chain has halted for
 * good. The vendor's own failed fetch never counts, or it would give the vendor a look at several outcomes.
 */
export const haltAttestationsNeededToVoid = 2;
