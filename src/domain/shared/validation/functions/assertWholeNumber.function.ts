export const assertWholeNumber = (value: number, nameForErrorMessage: string): void => {
    if (!Number.isSafeInteger(value)) throw new RangeError(`${nameForErrorMessage} must be a whole number`);
};
