/**
 * Exactly 32 bytes written as 64 lower-case hex characters: hashes, ids and beacon randomness. Made only by
 * toBytes32Hex or the hashing helpers, so a malformed value is never hashed or compared.
 */
export type Bytes32Hex = string & { readonly brand: "Bytes32Hex" };
