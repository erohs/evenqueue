/**
 * entry-codes: derives buyers' codes and place ids from a form's nonce; form-guard: signs entry and recovery forms;
 * waitlist: keys one waitlist's recovery-code checks, with that waitlist's own salt.
 */
export type ServerKeyPurpose = "entry-codes" | "form-guard" | "waitlist";
