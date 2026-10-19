import type { IQrModules } from "../interfaces/IQrModules.ts";
import { setFunctionModule } from "./setFunctionModule.function.ts";

/**
 * Concentric squares around a centre, each ring dark or light by its distance from the centre: finder patterns with
 * their separators, and alignment patterns.
 */
export const drawSquarePattern = (
    modules: IQrModules,
    centreRow: number,
    centreColumn: number,
    radius: number,
    isRingDark: (distance: number) => boolean,
): void => {
    for (let rowOffset = -radius; rowOffset <= radius; rowOffset++) {
        for (let columnOffset = -radius; columnOffset <= radius; columnOffset++) {
            const distance = Math.max(Math.abs(rowOffset), Math.abs(columnOffset));
            setFunctionModule(modules, centreRow + rowOffset, centreColumn + columnOffset, isRingDark(distance));
        }
    }
};
