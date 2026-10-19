import type { JoinWaitlistOutcome } from "#application/join-waitlist/types/JoinWaitlistOutcome.type.ts";
import type { IMessageText } from "../interfaces/IMessageText.ts";

type JoinRefusal = Exclude<JoinWaitlistOutcome["kind"], "joined" | "confirm-again" | "drop-not-found">;

export const joinRefusalMessages: Readonly<Record<JoinRefusal, IMessageText>> = {
    "entry-closed": { heading: "Joining is closed", message: "New places can't be added to this drop." },
    "waitlist-full": {
        heading: "The waitlist is full",
        message: "It has reached the number of places the vendor set, so no more can join.",
    },
    "codes-already-replaced": {
        heading: "You've already joined",
        message: "This form was used before, and its codes have since been replaced. Use your newest codes.",
    },
};
