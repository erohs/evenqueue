import type { IQrModules } from "../interfaces/IQrModules.ts";
import { bitsOf } from "./bitsOf.function.ts";

/**
 * Codeword bits, most significant first, in two-module columns from the right, alternately upwards and downwards,
 * stepping over the vertical timing line and every function module. Modules left over are the light remainder bits.
 */
export const placeCodewords = (modules: IQrModules, codewords: readonly number[]): void => {
    const bits = codewords.flatMap((codeword) => bitsOf(codeword, 8));
    let next = 0;
    for (let right = modules.size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;
        const isUpward = ((right + 1) & 2) === 0;
        for (let step = 0; step < modules.size; step++) {
            const row = isUpward ? modules.size - 1 - step : step;
            for (const column of [right, right - 1]) {
                const darkRow = modules.isDark[row];
                if (darkRow === undefined || modules.isFunction[row]?.[column] !== false) continue;
                darkRow[column] = bits[next] === 1;
                next++;
            }
        }
    }
};
