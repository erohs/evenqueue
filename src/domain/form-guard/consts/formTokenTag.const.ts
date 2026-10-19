/** Versioned, so a token from another layout can never verify. */
export const formTokenTag = new TextEncoder().encode("evenqueue/form-token/v1\u0000");
