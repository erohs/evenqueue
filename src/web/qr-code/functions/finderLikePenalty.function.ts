const finderLike = [true, false, true, true, true, false, true];

const indexOfFinderLike = (line: readonly boolean[], from: number): number => {
    for (let at = from; at + finderLike.length <= line.length; at++) {
        if (finderLike.every((isDark, i) => line[at + i] === isDark)) return at;
    }
    return -1;
};

/**
 * Rule N3: 40 for each dark-light-dark-dark-dark-light-dark run with four light modules, or the symbol's edge, on
 * either side. Matches are counted the way the segno library counts them, so mask choices agree with its vectors.
 */
export const finderLikePenalty = (line: readonly boolean[]): number => {
    let score = 0;
    for (let at = indexOfFinderLike(line, 0); at !== -1;) {
        const end = at + finderLike.length;
        const isLightBefore = !line.slice(Math.max(at - 4, 0), at).some(Boolean);
        const isLightAfter = !line.slice(end, Math.min(end + 4, line.length)).some(Boolean);
        const isCounted = at === 0 || end === line.length || isLightBefore || isLightAfter;
        score += isCounted ? 40 : 0;
        at = indexOfFinderLike(line, isCounted ? end : at + 4);
    }
    return score;
};
