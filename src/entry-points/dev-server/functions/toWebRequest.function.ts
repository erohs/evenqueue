import type { IncomingMessage } from "node:http";
import { Readable } from "node:stream";

export const toWebRequest = (incoming: IncomingMessage, origin: string): Request => {
    const headers = new Headers();
    for (let i = 0; i + 1 < incoming.rawHeaders.length; i += 2) {
        headers.append(incoming.rawHeaders[i] ?? "", incoming.rawHeaders[i + 1] ?? "");
    }
    const hasBody = incoming.method !== "GET" && incoming.method !== "HEAD";
    return new Request(new URL(incoming.url ?? "/", origin), {
        method: incoming.method ?? "GET",
        headers,
        ...(hasBody ? { body: Readable.toWeb(incoming) as ReadableStream<Uint8Array>, duplex: "half" } : {}),
    });
};
