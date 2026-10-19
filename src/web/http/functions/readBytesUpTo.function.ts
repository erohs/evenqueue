import { concatenateBytes } from "#domain/shared/bytes/functions/concatenateBytes.function.ts";

/** The whole stream, or null as soon as it passes `limit` bytes, so an oversized body is never held in memory. */
export const readBytesUpTo = async (stream: ReadableStream<Uint8Array>, limit: number): Promise<Uint8Array | null> => {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    for (let read = await reader.read(); !read.done; read = await reader.read()) {
        length += read.value.length;
        if (length > limit) {
            await reader.cancel();
            return null;
        }
        chunks.push(read.value);
    }
    return concatenateBytes(...chunks);
};
