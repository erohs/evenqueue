/** Runs an operation once to warm up, then `runs` times, and returns the median wall time in milliseconds. */
export const medianMilliseconds = async (operation: () => unknown, runs: number): Promise<number> => {
    await operation();
    const timings: number[] = [];
    for (let run = 0; run < runs; run++) {
        const startedAt = performance.now();
        await operation();
        timings.push(performance.now() - startedAt);
    }
    return timings.toSorted((first, second) => first - second)[Math.floor(runs / 2)] ?? Number.NaN;
};
