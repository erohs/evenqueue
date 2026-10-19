/** An SVG path of the dark modules, one rectangle per horizontal run, offset by the quiet zone. */
export const qrCodePath = (isDark: readonly (readonly boolean[])[], quietZone: number): string =>
    isDark
        .flatMap((row, rowIndex) => {
            const runs: string[] = [];
            row.forEach((isModuleDark, column) => {
                if (!isModuleDark || row[column - 1] === true) return;
                const length = row.slice(column).findIndex((isNext) => !isNext);
                const width = length === -1 ? row.length - column : length;
                runs.push(`M${column + quietZone} ${rowIndex + quietZone}h${width}v1h-${width}z`);
            });
            return runs;
        })
        .join("");
