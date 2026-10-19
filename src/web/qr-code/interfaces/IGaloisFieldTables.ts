export interface IGaloisFieldTables {
    /** α to the power of the index, doubled in length so a sum of two logarithms needs no reduction. */
    readonly exponents: readonly number[];
    readonly logarithms: readonly number[];
}
