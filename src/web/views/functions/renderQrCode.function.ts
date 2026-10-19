import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { encodeQrCode } from "#web/qr-code/functions/encodeQrCode.function.ts";
import { qrCodePath } from "#web/qr-code/functions/qrCodePath.function.ts";

const quietZone = 4;

/**
 * The code alone, without separators, as an inline SVG: black on white in every theme, because scanners read
 * inverted codes poorly. The code itself is printed beside it, so the image only needs a short name.
 */
export const renderQrCode = (displayedCode: string, name: string): ISafeHtml => {
    const isDark = encodeQrCode(displayedCode.replaceAll("-", ""));
    const side = isDark.length + quietZone * 2;
    return html`<svg
        class="qr-code"
        viewBox="0 0 ${side} ${side}"
        role="img"
        aria-label="${name} as a QR code"
        shape-rendering="crispEdges">
        <rect width="${side}" height="${side}" fill="#ffffff" />
        <path fill="#000000" d="${qrCodePath(isDark, quietZone)}" />
    </svg>`;
};
