/** Leaves and inner nodes are hashed with different first bytes, so a node can never pass for a leaf. */
export const merkleHashPrefixes = {
    leaf: new Uint8Array([0]),
    node: new Uint8Array([1]),
} as const;
