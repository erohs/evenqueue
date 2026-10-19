/** `value` as `length` bits, most significant first. */
export const bitsOf = (value: number, length: number): number[] =>
    Array.from({ length }, (_, i) => (value >>> (length - 1 - i)) & 1);
