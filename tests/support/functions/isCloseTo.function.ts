export const isCloseTo = (actual: number, expected: number, tolerance: number): boolean =>
    Math.abs(actual - expected) < tolerance;
