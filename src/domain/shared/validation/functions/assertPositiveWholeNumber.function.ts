import { assertWholeNumber } from "./assertWholeNumber.function.ts";

export const assertPositiveWholeNumber = (value: number, nameForErrorMessage: string): void => {
    assertWholeNumber(value, nameForErrorMessage);
    if (value <= 0) throw new RangeError(`${nameForErrorMessage} must be greater than zero`);
};
