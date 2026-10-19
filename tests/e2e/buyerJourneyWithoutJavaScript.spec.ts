import { expect, test, type Page } from "@playwright/test";
import { shortestFormFillMilliseconds } from "#tests/support/consts/shortestFormFillMilliseconds.const.ts";

test.describe.configure({ mode: "serial" });
test.use({ javaScriptEnabled: false });

let page: Page;
const mainHeading = () => page.getByRole("heading", { level: 1 });

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ javaScriptEnabled: false });
});

test.afterAll(async () => {
    await page.close();
});

test.describe("Using the buyer pages in a browser with JavaScript off, when a buyer joins, checks and leaves", () => {
    test("then joining should show the codes, each code that can be scanned with a QR code", async () => {
        await page.goto("/");
        await page.waitForTimeout(shortestFormFillMilliseconds);
        await page.getByRole("button", { name: "Join the waitlist" }).click();
        await expect(mainHeading()).toHaveText("You're on the waitlist");
        await expect(page.getByRole("img", { name: /as a QR code$/u })).toHaveCount(2);
    });

    test("then checking the place right away should open it with full access", async () => {
        await page.getByRole("button", { name: "Check my place now" }).click();
        await expect(mainHeading()).toHaveText("Your place");
        await expect(page.getByRole("button", { name: "Leave the waitlist" })).toBeVisible();
    });

    test("then leaving should ask once and then delete the place", async () => {
        await page.getByRole("button", { name: "Leave the waitlist" }).click();
        await page.getByRole("button", { name: "Yes, leave the waitlist" }).click();
        await expect(mainHeading()).toHaveText("You've left the waitlist");
    });
});
