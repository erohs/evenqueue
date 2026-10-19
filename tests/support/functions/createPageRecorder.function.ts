import type { IPageRecorder } from "../interfaces/IPageRecorder.ts";
import type { IPageVisit } from "../interfaces/IPageVisit.ts";
import type { ITestServices } from "../interfaces/ITestServices.ts";
import { visitPage } from "./visitPage.function.ts";

export const createPageRecorder = (services: ITestServices): IPageRecorder => {
    const pages = new Map<string, IPageVisit>();
    return {
        pages,
        visit: async (name, method, subpath, fields = {}) => {
            const visit = await visitPage(services, method, `/d/${services.openDrop.dropId}${subpath}`, fields);
            pages.set(name, visit);
            return visit.body;
        },
    };
};
