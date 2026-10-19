import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { html } from "#web/html/functions/html.function.ts";
import { pageResponse } from "../functions/pageResponse.function.ts";

const page = html`<p>Hello</p>`;

describe("Using pageResponse, for any buyer page", () => {
    const response = pageResponse(page);

    test("then it should never be cached, because pages carry codes and form tokens", () => {
        assert.equal(response.headers.get("cache-control"), "no-store");
    });

    test("then it should allow no script at all", () => {
        assert.match(response.headers.get("content-security-policy") ?? "", /^default-src 'none';/u);
    });

    test("then it should send no referrer", () => {
        assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    });

    test("then no site should be able to frame it", () => {
        assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'$/u);
    });
});

describe("Using pageResponse, for an entry page the vendor embeds on their site", () => {
    test("then only the listed sites should be able to frame it", () => {
        const response = pageResponse(page, { embedOrigins: ["https://shop.example", "https://blog.example"] });
        assert.match(
            response.headers.get("content-security-policy") ?? "",
            /frame-ancestors https:\/\/shop\.example https:\/\/blog\.example$/u,
        );
    });
});

describe("Using pageResponse, when the buyer finishes", () => {
    test("then it should ask the browser to clear its cache", () => {
        assert.equal(pageResponse(page, { shouldClearCache: true }).headers.get("clear-site-data"), '"cache"');
    });
});
