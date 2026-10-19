export interface IBenchmark {
    readonly name: string;
    /** Where it runs: on a buyer's request, which has a 10 ms CPU budget on Workers Free, or in the sliced close. */
    readonly runsOn: "buyer request" | "close pipeline" | "verifier";
    readonly runs: number;
    readonly operation: () => unknown;
}
