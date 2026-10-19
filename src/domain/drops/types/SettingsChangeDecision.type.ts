import type { IDrop } from "../interfaces/IDrop.ts";
import type { ISettingChange } from "../interfaces/ISettingChange.ts";

/**
 * All or nothing: one refused setting refuses the whole submission. An accepted change gives the drop to store and
 * what to record. A change that waits out a notice needs a fresh sign-in first.
 */
export type SettingsChangeDecision =
    | { readonly isAccepted: false; readonly refusals: readonly string[] }
    | {
          readonly isAccepted: true;
          readonly drop: IDrop;
          readonly changes: readonly ISettingChange[];
          readonly isFreshSignInRequired: boolean;
      };
