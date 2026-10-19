import type { IPublishedDrawRestoreInput } from "../interfaces/IPublishedDrawRestoreInput.ts";
import type { PublishedDrawRestoreResult } from "../types/PublishedDrawRestoreResult.type.ts";
import { findOwnLeafInPublishedDraw } from "./findOwnLeafInPublishedDraw.function.ts";

/**
 * The last resort when a vendor's database is lost with no snapshot: a buyer brings their current entry code to the
 * new deployment and gets their place back from the public record, including the step up for missing out on that
 * draw. It takes the entry code, not the view key, so a helper holding only the view key cannot take the place. The
 * caller issues new codes and must refuse a second restore of the same place.
 */
export const restorePlaceFromPublishedDraw = async (
    input: IPublishedDrawRestoreInput,
): Promise<PublishedDrawRestoreResult> => {
    const { entrySecret, drawId, publishedLeaves, recoveriesSinceCommit, rule } = input;
    const leaf = await findOwnLeafInPublishedDraw(entrySecret, drawId, publishedLeaves, recoveriesSinceCommit);
    if (leaf === "replaced") return { status: "code-replaced" };
    if (leaf === null) return { status: "not-in-draw" };
    if (input.offeredPublicDrawIds.has(leaf.publicDrawId)) return { status: "needs-vendor-review" };
    const asCommitted = rule.placeWithPriority(input.newPlaceId, leaf.priority);
    if (!input.hasDrawRun) return { status: "restored", place: asCommitted };
    const afterMissingOut = rule.placeAfterDrop(asCommitted, "not-offered", asCommitted.entryWindowNumber);
    return afterMissingOut === null ? { status: "not-kept" } : { status: "restored", place: afterMissingOut };
};
