import type { CancelRecoveryOutcome } from "#application/cancel-recovery/types/CancelRecoveryOutcome.type.ts";
import type { IMessageText } from "../interfaces/IMessageText.ts";

type CancelMessage = Exclude<CancelRecoveryOutcome, "code-not-recognised" | "drop-not-found">;

export const cancelRecoveryMessages: Readonly<Record<CancelMessage, IMessageText>> = {
    cancelled: {
        heading: "The new codes were cancelled",
        message: "They will never work. Your entry code keeps working as before.",
    },
    "nothing-to-cancel": {
        heading: "Nothing to cancel",
        message: "No new codes are waiting for this place. Your entry code works as before.",
    },
    "needs-entry-code": {
        heading: "This needs the entry code",
        message: "A view key can only check a place. Cancelling new codes needs the entry code.",
    },
};
