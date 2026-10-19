import { galoisFieldTables } from "../consts/galoisFieldTables.const.ts";
import { galoisMultiply } from "./galoisMultiply.function.ts";

/** The product of (x − αⁱ) for i below `degree`, highest power first, so its first coefficient is 1. */
export const reedSolomonGenerator = (degree: number): number[] => {
    let polynomial = [1];
    for (let i = 0; i < degree; i++) {
        const root = galoisFieldTables.exponents[i] ?? 0;
        const next = Array.from({ length: polynomial.length + 1 }, () => 0);
        polynomial.forEach((coefficient, power) => {
            next[power] = (next[power] ?? 0) ^ coefficient;
            next[power + 1] = (next[power + 1] ?? 0) ^ galoisMultiply(coefficient, root);
        });
        polynomial = next;
    }
    return polynomial;
};
