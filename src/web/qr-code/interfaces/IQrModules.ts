/** A symbol being built: which modules are dark, and which belong to fixed patterns that data and masks skip. */
export interface IQrModules {
    readonly size: number;
    readonly isDark: boolean[][];
    readonly isFunction: boolean[][];
}
