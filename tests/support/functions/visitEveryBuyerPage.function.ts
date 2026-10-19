import type { Page } from "@playwright/test";
import { shortestFormFillMilliseconds } from "../consts/shortestFormFillMilliseconds.const.ts";

/** Waits for the next page's main heading, because some engines finish a form's navigation after the click returns. */
const arriveAt = async (page: Page, heading: string): Promise<void> => {
    await page.getByRole("heading", { level: 1, name: heading, exact: true }).waitFor();
};

/**
 * Walks a browser through every kind of buyer page, by its buttons and links, and calls `onPage` on each one with
 * its name: the drop page, the codes, the status, leaving, a code that is not recognised and the recovery form.
 */
export const visitEveryBuyerPage = async (page: Page, onPage: (name: string) => Promise<void>): Promise<void> => {
    await page.goto("/");
    const dropAddress = page.url();
    await onPage("drop page");
    await page.waitForTimeout(shortestFormFillMilliseconds);
    await page.getByRole("button", { name: "Join the waitlist" }).click();
    await arriveAt(page, "You're on the waitlist");
    await onPage("codes");
    await page.getByRole("button", { name: "Check my place now" }).click();
    await arriveAt(page, "Your place");
    await onPage("status");
    await page.getByRole("button", { name: "Leave the waitlist" }).click();
    await arriveAt(page, "Leave the waitlist?");
    await onPage("leave confirmation");
    await page.goto(`${dropAddress}/status`);
    await page.getByLabel("Entry code, phrase or view key").fill("0000-0000-0000-0000-0000-0000-00");
    await page.getByRole("button", { name: "Check my place" }).click();
    await page.getByText("That code isn't recognised").waitFor();
    await onPage("code not recognised");
    await page.goto(`${dropAddress}/recover`);
    await onPage("recovery form");
};
