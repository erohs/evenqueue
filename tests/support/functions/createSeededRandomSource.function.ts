import type { IRandomSource } from "#application/ports/interfaces/IRandomSource.ts";
import { createSeededRandom } from "./createSeededRandom.function.ts";

/** Repeatable bytes, so a failing use-case test fails the same way every run. Never for real keys. */
export const createSeededRandomSource = (seed: number): IRandomSource => {
    const random = createSeededRandom(seed);
    return { bytes: (length) => Uint8Array.from({ length }, () => Math.floor(random() * 256)) };
};
