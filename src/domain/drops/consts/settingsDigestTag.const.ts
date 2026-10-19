/** Versioned: the public verifier recomputes the digest, so a new layout needs a new tag and new vectors. */
export const settingsDigestTag = new TextEncoder().encode("evenqueue/settings-digest/v1\u0000");
