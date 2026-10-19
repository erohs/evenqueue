import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { fieldValueOnPage } from "#tests/support/functions/fieldValueOnPage.function.ts";
import { visitPage } from "#tests/support/functions/visitPage.function.ts";

const services = await createTestServices({
    pageText: `<img src=x onerror="alert(1)"> Read "this"`,
    embedOrigins: ["https://shop.example"],
});
const dropPath = `/d/${services.openDrop.dropId}`;

describe("Using handleBuyerRequest, for an address that is not a buyer page", () => {
    test("then it should answer not found", async () => {
        const statuses = await Promise.all(
            ["/", "/d/ABC", `${dropPath}/admin`, `${dropPath}/status/extra`].map(
                async (path) => (await visitPage(services, "GET", path)).status,
            ),
        );
        assert.deepEqual(statuses, [404, 404, 404, 404]);
    });
});

describe("Using handleBuyerRequest, for a drop that is still a draft", () => {
    test("then it should answer not found, because buyers never see a draft", async () => {
        assert.equal((await visitPage(services, "GET", `/d/${services.draftDrop.dropId}`)).status, 404);
    });
});

describe("Using handleBuyerRequest, when a page is asked for with a method it does not take", () => {
    test("then it should answer 405 and list the methods it takes", async () => {
        const visit = await visitPage(services, "PUT", `${dropPath}/status`);
        assert.deepEqual([visit.status, visit.headers.get("allow")], [405, "GET, POST"]);
    });
});

describe("Using handleBuyerRequest, when the vendor's page text holds markup", () => {
    test("then it should show the text and never the markup", async () => {
        const body = (await visitPage(services, "GET", dropPath)).body;
        assert.ok(
            body.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt; Read &quot;this&quot;") &&
                !body.includes("<img"),
        );
    });
});

describe("Using handleBuyerRequest, for the drop page of a vendor who embeds it", () => {
    test("then only the vendor's listed site should be able to frame it", async () => {
        const policy = (await visitPage(services, "GET", dropPath)).headers.get("content-security-policy");
        assert.match(policy ?? "", /frame-ancestors https:\/\/shop\.example$/u);
    });
});

describe("Using handleBuyerRequest, when a plain form on the vendor's own site posts with no token", () => {
    test("then it should show a confirm page whose form then joins", async () => {
        const confirmPage = await visitPage(services, "POST", `${dropPath}/enter`);
        services.clock.advanceBy(5_000);
        const formToken = fieldValueOnPage(confirmPage.body, "formToken");
        const joined = await visitPage(services, "POST", `${dropPath}/enter`, { formToken, website: "" });
        assert.ok(
            confirmPage.body.includes("<h1>Confirm you want to join</h1>") &&
                joined.body.includes("<h1>You&#39;re on the waitlist</h1>"),
        );
    });
});

describe("Using handleBuyerRequest, when one address sends more code lookups than a minute allows", () => {
    test("then it should ask it to wait a minute, with Retry-After", async () => {
        const limited = await createTestServices();
        const lookups = Array.from({ length: 31 }, () =>
            visitPage(limited, "POST", `/d/${limited.openDrop.dropId}/status`, { code: "x" }),
        );
        const last = (await Promise.all(lookups)).at(-1);
        assert.deepEqual([last?.status, last?.headers.get("retry-after")], [429, "60"]);
    });
});
