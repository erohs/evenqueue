import type { IQrModules } from "../interfaces/IQrModules.ts";

/** Ignores positions outside the symbol, so patterns near an edge can be drawn whole. */
export const setFunctionModule = (modules: IQrModules, row: number, column: number, isDark: boolean): void => {
    const darkRow = modules.isDark[row];
    const functionRow = modules.isFunction[row];
    if (darkRow === undefined || functionRow === undefined || column < 0 || column >= modules.size) return;
    darkRow[column] = isDark;
    functionRow[column] = true;
};
