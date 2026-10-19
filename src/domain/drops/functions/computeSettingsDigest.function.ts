import { canonicalJson } from "#domain/public-log/functions/canonicalJson.function.ts";
import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlist } from "#domain/waitlist/interfaces/IWaitlist.ts";
import { settingsDigestTag } from "../consts/settingsDigestTag.const.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";

/** Covers the waitlist's lifelong settings and every drop setting fixed once the drop opens; the rest change in public. */
export const computeSettingsDigest = (waitlist: IWaitlist, settings: IDropSettings): Promise<Bytes32Hex> =>
    sha256Hex(
        settingsDigestTag,
        new TextEncoder().encode(
            canonicalJson({
                allocationRuleId: waitlist.allocationRuleId,
                shouldForgetPlacesAfterEachDrop: waitlist.shouldForgetPlacesAfterEachDrop,
                entrantCap: settings.entrantCap,
                entryWindowMilliseconds: settings.entryWindow,
            }),
        ),
    );
