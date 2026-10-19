/** A whole number from `low` to `high` inclusive. */
export const randomWholeNumber = (random: () => number, low: number, high: number): number =>
    low + Math.floor(random() * (high - low + 1));
