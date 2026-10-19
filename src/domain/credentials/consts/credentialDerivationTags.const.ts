const encodeTag = (name: string): Uint8Array => new TextEncoder().encode(`evenqueue/${name}/v1\u0000`);

/** Versioned, one per purpose, so no derived value can stand in for another. Changing one means a new version. */
export const credentialDerivationTags = {
    entrySecret: encodeTag("entry-secret"),
    recoveryCode: encodeTag("recovery-code"),
    viewKey: encodeTag("view-key"),
    entrySecretLookup: encodeTag("entry-secret-lookup"),
    viewKeyLookup: encodeTag("view-key-lookup"),
    recoveryCodeCheck: encodeTag("recovery-code-check"),
} as const;
