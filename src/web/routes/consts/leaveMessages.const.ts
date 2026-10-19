import type { WithdrawPlaceOutcome } from "#application/withdraw-place/types/WithdrawPlaceOutcome.type.ts";
import type { IMessageText } from "../interfaces/IMessageText.ts";

type LeaveMessage = Extract<WithdrawPlaceOutcome, "withdrawn" | "needs-entry-code">;

export const leaveMessages: Readonly<Record<LeaveMessage, IMessageText>> = {
    withdrawn: {
        heading: "You've left the waitlist",
        message: "Your place has been deleted. Nothing about it is kept.",
    },
    "needs-entry-code": {
        heading: "This needs the entry code",
        message: "A view key can only check a place. Leaving needs the entry code.",
    },
};
