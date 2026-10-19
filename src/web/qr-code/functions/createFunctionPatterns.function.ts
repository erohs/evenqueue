import type { IQrModules } from "../interfaces/IQrModules.ts";
import type { IQrVersion } from "../interfaces/IQrVersion.ts";
import { drawSquarePattern } from "./drawSquarePattern.function.ts";
import { formatInformationPositions } from "./formatInformationPositions.function.ts";
import { setFunctionModule } from "./setFunctionModule.function.ts";

/**
 * Finders with separators, timing lines, the alignment pattern, and the format areas and dark module reserved as
 * light: they are filled in after the mask is chosen, so they take no part in choosing it.
 */
export const createFunctionPatterns = ({ size, alignmentCentre }: IQrVersion): IQrModules => {
    const grid = () => Array.from({ length: size }, () => Array.from({ length: size }, () => false));
    const modules: IQrModules = { size, isDark: grid(), isFunction: grid() };
    for (const [row, column] of [
        [3, 3],
        [3, size - 4],
        [size - 4, 3],
    ] as const) {
        drawSquarePattern(modules, row, column, 4, (distance) => distance !== 2 && distance !== 4);
    }
    for (let i = 8; i < size - 8; i++) {
        setFunctionModule(modules, 6, i, i % 2 === 0);
        setFunctionModule(modules, i, 6, i % 2 === 0);
    }
    if (alignmentCentre !== null) {
        drawSquarePattern(modules, alignmentCentre, alignmentCentre, 2, (distance) => distance !== 1);
    }
    for (const [row, column] of formatInformationPositions(size).flat()) setFunctionModule(modules, row, column, false);
    setFunctionModule(modules, size - 8, 8, false);
    return modules;
};
