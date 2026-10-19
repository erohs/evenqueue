import { galoisMultiply } from "./galoisMultiply.function.ts";
import { reedSolomonGenerator } from "./reedSolomonGenerator.function.ts";

/** The error correction codewords: the data, as a polynomial, divided by the generator. */
export const reedSolomonRemainder = (data: readonly number[], degree: number): number[] => {
    const generator = reedSolomonGenerator(degree).slice(1);
    let remainder = Array.from({ length: degree }, () => 0);
    for (const codeword of data) {
        const factor = codeword ^ (remainder[0] ?? 0);
        remainder = [...remainder.slice(1), 0].map((value, i) => value ^ galoisMultiply(generator[i] ?? 0, factor));
    }
    return remainder;
};
