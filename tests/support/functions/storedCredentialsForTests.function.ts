import type { IStoredCredentials } from "#domain/credentials/interfaces/IStoredCredentials.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

export const storedCredentialsForTests = (name: string): IStoredCredentials => ({
    entrySecretLookup: deterministicBytes32Hex(`${name}/entry`),
    viewKeyLookup: deterministicBytes32Hex(`${name}/view`),
    recoveryCodeCheck: deterministicBytes32Hex(`${name}/recovery`),
});
