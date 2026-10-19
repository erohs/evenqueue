import { galoisFieldTables } from "../consts/galoisFieldTables.const.ts";

const { exponents, logarithms } = galoisFieldTables;

export const galoisMultiply = (first: number, second: number): number =>
    first === 0 || second === 0 ? 0 : (exponents[(logarithms[first] ?? 0) + (logarithms[second] ?? 0)] ?? 0);
