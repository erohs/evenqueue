import type { IPageVisit } from "../interfaces/IPageVisit.ts";
import type { ITestServices } from "../interfaces/ITestServices.ts";
import { codesOnPage } from "./codesOnPage.function.ts";
import { createPageRecorder } from "./createPageRecorder.function.ts";
import { fieldValueOnPage } from "./fieldValueOnPage.function.ts";
import { phraseOnPage } from "./phraseOnPage.function.ts";

/**
 * One buyer's whole visit with JavaScript off: join, check, ask for new codes, cancel them, leave and finish. Returns
 * every page seen, by name, so tests can check each one.
 */
export const walkBuyerJourney = async (services: ITestServices): Promise<ReadonlyMap<string, IPageVisit>> => {
    const { pages, visit } = createPageRecorder(services);
    const joinToken = fieldValueOnPage(await visit("drop page", "GET", ""), "formToken");
    services.clock.advanceBy(5_000);
    const codesPage = await visit("codes", "POST", "/enter", { formToken: joinToken, website: "" });
    const [entryCode = "", viewKey = "", recoveryCode = ""] = codesOnPage(codesPage);
    await visit("status by entry code", "POST", "/status", { code: entryCode.toLowerCase().replaceAll("-", " ") });
    await visit("status by view key", "POST", "/status", { code: viewKey });
    await visit("status by phrase", "POST", "/status", { code: phraseOnPage(codesPage) });
    await visit("status by wrong code", "POST", "/status", { code: "0000-0000-0000-0000-0000-0000-00" });
    const recoveryToken = fieldValueOnPage(await visit("recovery form", "GET", "/recover"), "formToken");
    services.clock.advanceBy(5_000);
    await visit("new codes", "POST", "/recover", { formToken: recoveryToken, website: "", recoveryCode });
    await visit("status with recovery pending", "POST", "/status", { code: entryCode });
    await visit("cancelled new codes", "POST", "/recover/cancel", { code: entryCode });
    await visit("leave confirmation", "POST", "/leave", { code: entryCode });
    await visit("left", "POST", "/leave", { code: entryCode, confirm: "yes" });
    await visit("status after leaving", "POST", "/status", { code: entryCode });
    await visit("finished", "POST", "/finish");
    return pages;
};
