import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { visibleTextOf } from "#tests/support/functions/visibleTextOf.function.ts";
import { walkBuyerJourney } from "#tests/support/functions/walkBuyerJourney.function.ts";
import { wordsKeptOffBuyerPagesIn } from "#domain/shared/text/functions/wordsKeptOffBuyerPagesIn.function.ts";

const pages = [...(await walkBuyerJourney(await createTestServices())).entries()];
const failing = (isFine: (body: string) => boolean): string[] =>
    pages.filter(([, visit]) => !isFine(visit.body)).map(([name]) => name);
const inputsWithoutLabels = (body: string): string[] =>
    [...body.matchAll(/<input\b(?![^>]*type="hidden")(?![^>]*\bhidden\b)[^>]*\bid="([^"]+)"/gu)]
        .map((match) => match[1] ?? "")
        .filter((id) => !body.includes(`<label for="${id}">`));

describe("Using every page of a buyer's visit, for the markup every buyer page keeps", () => {
    test("then no page should carry a script", () => {
        assert.deepEqual(
            failing((body) => !/<script/iu.test(body)),
            [],
        );
    });

    test("then every page should name its language and have exactly one main heading", () => {
        assert.deepEqual(
            failing((body) => body.includes('<html lang="en">') && body.split("<h1>").length === 2),
            [],
        );
    });

    test("then every visible field should have a label", () => {
        assert.deepEqual(
            failing((body) => inputsWithoutLabels(body).length === 0),
            [],
        );
    });
});

describe("Using every page of a buyer's visit, for the words and caching every buyer page keeps", () => {
    test("then no page should use the gambling words kept off buyer pages", () => {
        assert.deepEqual(
            failing((body) => wordsKeptOffBuyerPagesIn(visibleTextOf(body)).length === 0),
            [],
        );
    });

    test("then every page should be sent with no-store", () => {
        const cached = pages.filter(([, visit]) => visit.headers.get("cache-control") !== "no-store");
        assert.deepEqual(
            cached.map(([name]) => name),
            [],
        );
    });
});
