const encodeTag = (name: string): Uint8Array => new TextEncoder().encode(`evenqueue/${name}/v1\u0000`);

/** Versioned, one per purpose. Changing one means a new protocol version and new test vectors. */
export const commitmentDerivationTags = {
    placeTag: encodeTag("place-tag"),
    publicDrawId: encodeTag("public-draw-id"),
} as const;
