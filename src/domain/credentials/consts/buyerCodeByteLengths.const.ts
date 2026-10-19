/**
 * The entry code and the view key are 128 bits (26 characters), enough that even a published plain hash would resist
 * offline search. The recovery code is 80 bits (16 characters): shorter to print and type, so it is only ever stored
 * under a keyed hash.
 */
export const buyerCodeByteLengths = {
    entrySecret: 16,
    viewKey: 16,
    recoveryCode: 10,
} as const;
