import { backgroundBenchmarks } from "./functions/backgroundBenchmarks.function.ts";
import { buyerRequestBenchmarks } from "./functions/buyerRequestBenchmarks.function.ts";
import { createBenchmarkFixtures } from "./functions/createBenchmarkFixtures.function.ts";
import { medianMilliseconds } from "./functions/medianMilliseconds.function.ts";

const buyerRequestBudgetMilliseconds = 10;
const fixtures = await createBenchmarkFixtures();

for (const benchmark of [...buyerRequestBenchmarks(fixtures), ...backgroundBenchmarks(fixtures)]) {
    const median = await medianMilliseconds(benchmark.operation, benchmark.runs);
    const isOverBudget = benchmark.runsOn === "buyer request" && median > buyerRequestBudgetMilliseconds;
    const verdict = isOverBudget ? "  OVER the 10 ms buyer-request budget" : "";
    console.log(`${median.toFixed(3).padStart(10)} ms  ${benchmark.runsOn.padEnd(15)} ${benchmark.name}${verdict}`);
}
console.log("Wall time in Node on this machine; Workers CPU time must be measured on the edge before release.");
