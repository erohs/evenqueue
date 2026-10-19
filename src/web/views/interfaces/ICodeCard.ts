export interface ICodeCard {
    readonly name: string;
    readonly code: string;
    readonly purpose: string;
    /** Phone cameras can read it, so nobody has to type the code. */
    readonly hasQrCode: boolean;
    /** Words read better in the body font than in the code font. */
    readonly isWords: boolean;
}
