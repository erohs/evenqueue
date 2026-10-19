import { randomWholeNumber } from "./randomWholeNumber.function.ts";

export const randomBytes = (random: () => number, length: number): Uint8Array<ArrayBuffer> =>
    Uint8Array.from({ length }, () => randomWholeNumber(random, 0, 255));
