import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { messageResponse } from "../functions/messageResponse.function.ts";

/** The answers several routes share. */
export const commonResponses = {
    notFound: (): Response =>
        messageResponse(
            "Page not found",
            "There's no waitlist page at this address. Check the link you were given.",
            null,
            {
                status: 404,
            },
        ),
    unreadableForm: (dropId: Bytes32Hex): Response =>
        messageResponse("That form couldn't be read", "Please go back and try again.", dropId, { status: 400 }),
    tooManyRequests: (dropId: Bytes32Hex): Response =>
        messageResponse(
            "Please wait a minute",
            "A lot of requests came from your connection in the last minute. If you share a connection, others may be using it too. Wait a minute, then try again: your place, if you have one, is safe.",
            dropId,
            { status: 429, retryAfterSeconds: 60 },
        ),
} as const;
