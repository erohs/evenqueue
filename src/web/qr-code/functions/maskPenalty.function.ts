import { finderLikePenalty } from "./finderLikePenalty.function.ts";
import { runPenalty } from "./runPenalty.function.ts";

const blockPenalty = (isDark: readonly (readonly boolean[])[]): number => {
    let score = 0;
    for (let row = 1; row < isDark.length; row++) {
        for (let column = 1; column < isDark.length; column++) {
            const isDarkHere = isDark[row]?.[column];
            const isBlock = [isDark[row]?.[column - 1], isDark[row - 1]?.[column], isDark[row - 1]?.[column - 1]].every(
                (isNeighbourDark) => isNeighbourDark === isDarkHere,
            );
            if (isBlock) score += 3;
        }
    }
    return score;
};

/**
 * The ISO/IEC 18004 penalty for one masked symbol: runs (N1), 2×2 blocks (N2), finder-like runs (N3) and the balance
 * of dark and light (N4). The lowest score wins, because scanners read such symbols most reliably.
 */
export const maskPenalty = (isDark: readonly (readonly boolean[])[]): number => {
    const columns = isDark.map((_, column) => isDark.map((row) => row[column] === true));
    const lines = [...isDark, ...columns];
    const darkCount = isDark.flat().filter(Boolean).length;
    const balance = 10 * Math.floor(Math.abs((darkCount / isDark.length ** 2) * 100 - 50) / 5);
    return lines.reduce(
        (score, line) => score + runPenalty(line) + finderLikePenalty(line),
        blockPenalty(isDark) + balance,
    );
};
