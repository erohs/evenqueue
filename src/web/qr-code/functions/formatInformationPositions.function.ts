/**
 * Both copies of the 15 format bits, as [row, column] in bit order from the least significant: one copy around the
 * top-left finder, skipping the timing patterns, and one split between the other two finders.
 */
export const formatInformationPositions = (size: number): (readonly [number, number])[][] => [
    Array.from({ length: 15 }, (_, bit): readonly [number, number] => {
        if (bit < 6) return [bit, 8];
        if (bit === 6) return [7, 8];
        if (bit === 7) return [8, 8];
        if (bit === 8) return [8, 7];
        return [8, 14 - bit];
    }),
    Array.from({ length: 15 }, (_, bit): readonly [number, number] =>
        bit < 8 ? [8, size - 1 - bit] : [size - 15 + bit, 8],
    ),
];
