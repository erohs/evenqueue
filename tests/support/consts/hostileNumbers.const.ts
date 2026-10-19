/** Numbers no time, count or duration may be: each compares as false or loses precision, so code could fail open. */
export const hostileNumbers: readonly number[] = [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    1.5,
    2 ** 53,
];
