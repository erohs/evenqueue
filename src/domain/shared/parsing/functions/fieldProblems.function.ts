/** One problem per field that is missing or fails its guard. */
export const fieldProblems = (
    record: Readonly<Record<string, unknown>>,
    guards: Readonly<Record<string, (field: unknown) => boolean>>,
): string[] =>
    Object.entries(guards).flatMap(([name, guard]) => (guard(record[name]) ? [] : [`${name} is missing or invalid`]));
