/** The eight data mask conditions of ISO/IEC 18004, numbered 0 to 7; a module where it holds is inverted. */
export const isMaskedModule = (mask: number, row: number, column: number): boolean => {
    const product = row * column;
    const conditions = [
        (row + column) % 2 === 0,
        row % 2 === 0,
        column % 3 === 0,
        (row + column) % 3 === 0,
        (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0,
        (product % 2) + (product % 3) === 0,
        ((product % 2) + (product % 3)) % 2 === 0,
        (((row + column) % 2) + (product % 3)) % 2 === 0,
    ];
    return conditions[mask] ?? false;
};
