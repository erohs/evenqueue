/** Rule N1: each run of five or more modules of one colour costs 3, plus 1 for each module past five. */
export const runPenalty = (line: readonly boolean[]): number => {
    let score = 0;
    let runLength = 0;
    line.forEach((isDark, i) => {
        runLength = i > 0 && isDark === line[i - 1] ? runLength + 1 : 1;
        const isRunEnd = i === line.length - 1 || line[i + 1] !== isDark;
        if (isRunEnd && runLength >= 5) score += runLength - 2;
    });
    return score;
};
