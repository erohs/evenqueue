import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { entrantInDraw } from "#tests/support/functions/entrantInDraw.function.ts";
import { publicDrawInputsFor } from "#tests/support/functions/publicDrawInputsFor.function.ts";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import { keepBestEntrantsAcrossSlices } from "../functions/keepBestEntrantsAcrossSlices.function.ts";
import { orderEntrantsForDraw } from "../functions/orderEntrantsForDraw.function.ts";
import type { IDrawEntrant } from "../interfaces/IDrawEntrant.ts";
import type { IRankedEntrant } from "../interfaces/IRankedEntrant.ts";

const placesToKeep = 12;
const sliceSizes = [1, 7, 33, 60];
const inputs = publicDrawInputsFor("sliced");

const mixedEntrants: IDrawEntrant[] = Array.from({ length: 60 }, (_, i) =>
    entrantInDraw(
        { ...createWaitlistPlace(deterministicBytes32Hex(`place-${i}`), i % 3), drawsEntered: i % 4 },
        "sliced",
    ),
);

const publicIds = (ranked: readonly IRankedEntrant[]): string[] => ranked.map((entrant) => entrant.publicDrawId);

const bestBySlices = async (rule: IAllocationRule, sliceSize: number): Promise<IRankedEntrant[]> => {
    let bestSoFar: IRankedEntrant[] = [];
    for (let start = 0; start < mixedEntrants.length; start += sliceSize) {
        const slice = mixedEntrants.slice(start, start + sliceSize);
        bestSoFar = await keepBestEntrantsAcrossSlices(rule, slice, inputs, placesToKeep, bestSoFar);
    }
    return bestSoFar;
};

for (const rule of Object.values(availableAllocationRules)) {
    describe(`Using keepBestEntrantsAcrossSlices with the ${rule.id} rule, when a draw runs in slices`, async () => {
        const fullDraw = (await orderEntrantsForDraw(rule, mixedEntrants, inputs)).slice(0, placesToKeep);
        for (const sliceSize of sliceSizes) {
            test(`then it should match a full draw with slices of ${sliceSize}`, async () => {
                assert.deepEqual(publicIds(await bestBySlices(rule, sliceSize)), publicIds(fullDraw));
            });
        }
    });
}
