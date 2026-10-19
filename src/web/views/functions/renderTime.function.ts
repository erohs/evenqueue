import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { utcTimeFormat } from "../consts/utcTimeFormat.const.ts";

export const renderTime = (time: EpochMilliseconds): ISafeHtml =>
    html`<time datetime="${new Date(time).toISOString()}">${utcTimeFormat.format(time)} UTC</time>`;
