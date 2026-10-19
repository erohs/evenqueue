import type { RateLimitBucket } from "#application/ports/types/RateLimitBucket.type.ts";
import { readFormFields } from "#web/http/functions/readFormFields.function.ts";
import type { IDropRequest } from "../interfaces/IDropRequest.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";

/** The form's fields, or the response to send instead: too many requests from this address, or an unreadable body. */
export const readLimitedForm = async (
    dropRequest: IDropRequest,
    bucket: RateLimitBucket,
): Promise<URLSearchParams | Response> => {
    const isWithinLimit = await dropRequest.services.rateLimiter.isWithinLimit(bucket, dropRequest.clientAddress);
    if (!isWithinLimit) return commonResponses.tooManyRequests(dropRequest.dropId);
    const fields = await readFormFields(dropRequest.request);
    return fields ?? commonResponses.unreadableForm(dropRequest.dropId);
};
