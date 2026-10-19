import type { IRandomSource } from "#application/ports/interfaces/IRandomSource.ts";

/** `crypto.getRandomValues`, available on Workers and Node alike. */
export const createWebCryptoRandomSource = (): IRandomSource => ({
    bytes: (length) => crypto.getRandomValues(new Uint8Array(length)),
});
