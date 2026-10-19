import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { codesOnPage } from "#tests/support/functions/codesOnPage.function.ts";
import { phraseOnPage } from "#tests/support/functions/phraseOnPage.function.ts";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { walkBuyerJourney } from "#tests/support/functions/walkBuyerJourney.function.ts";
import type { IPageVisit } from "#tests/support/interfaces/IPageVisit.ts";

const pages = await walkBuyerJourney(await createTestServices());
const page = (name: string): IPageVisit => pages.get(name) ?? assert.fail(`no page named ${name}`);
const hasHeading = (name: string, heading: string) => page(name).body.includes(`<h1>${heading}</h1>`);

describe("Using the buyer pages with JavaScript off, when a buyer joins", () => {
    test("then the codes page should show an entry code, a view key and a recovery code", () => {
        assert.deepEqual(
            codesOnPage(page("codes").body).map((code) => code.replaceAll("-", "").length),
            [26, 26, 16],
        );
    });
});

describe("Using the buyer pages with JavaScript off, when the codes are shown", () => {
    test("then the phrase should be seven words", () => {
        assert.equal(phraseOnPage(page("codes").body).split(" ").length, 7);
    });

    test("then the entry code and the view key should each come with a QR code", () => {
        assert.equal((page("codes").body.match(/<svg\b/gu) ?? []).length, 2);
    });
});

describe("Using the buyer pages with JavaScript off, when the buyer checks their place", () => {
    test("then the phrase should show the place with a way to leave", () => {
        assert.ok(hasHeading("status by phrase", "Your place") && page("status by phrase").body.includes("/leave"));
    });

    test("then the entry code, typed loosely, should show the place with a way to leave", () => {
        assert.ok(
            hasHeading("status by entry code", "Your place") && page("status by entry code").body.includes("/leave"),
        );
    });

    test("then the view key should show the place without a way to leave", () => {
        assert.ok(
            hasHeading("status by view key", "Your place") && !page("status by view key").body.includes("/leave"),
        );
    });

    test("then a wrong code should be answered as unprocessable", () => {
        assert.equal(page("status by wrong code").status, 422);
    });

    test("then a wrong code should come back with its error linked to the field", () => {
        assert.match(
            page("status by wrong code").body,
            /aria-describedby="code-hint code-error"\s+aria-invalid="true"/u,
        );
    });
});

describe("Using the buyer pages with JavaScript off, when new codes are requested and then cancelled", () => {
    test("then the old code's status should warn about them and offer to cancel", () => {
        assert.match(page("status with recovery pending").body, /New codes were requested[\s\S]*\/recover\/cancel/u);
    });

    test("then cancelling should confirm that the new codes will never work", () => {
        assert.ok(hasHeading("cancelled new codes", "The new codes were cancelled"));
    });
});

describe("Using the buyer pages with JavaScript off, when the buyer leaves", () => {
    test("then it should ask once before deleting the place", () => {
        assert.ok(
            hasHeading("leave confirmation", "Leave the waitlist?") &&
                hasHeading("left", "You&#39;ve left the waitlist"),
        );
    });

    test("then the entry code should find nothing afterwards", () => {
        assert.equal(page("status after leaving").status, 422);
    });
});

describe("Using the buyer pages with JavaScript off, when the buyer finishes", () => {
    test("then the browser should be asked to clear its cache", () => {
        assert.equal(page("finished").headers.get("clear-site-data"), '"cache"');
    });
});
