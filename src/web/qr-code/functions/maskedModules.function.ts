import type { IQrModules } from "../interfaces/IQrModules.ts";
import { isMaskedModule } from "./isMaskedModule.function.ts";

/** A copy with the mask applied to data modules only; function patterns are never masked. */
export const maskedModules = (modules: IQrModules, mask: number): boolean[][] =>
    modules.isDark.map((darkRow, row) =>
        darkRow.map((isDark, column) =>
            modules.isFunction[row]?.[column] === true ? isDark : isDark !== isMaskedModule(mask, row, column),
        ),
    );
