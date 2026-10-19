import type { ServerResponse } from "node:http";

export const sendWebResponse = async (response: Response, outgoing: ServerResponse): Promise<void> => {
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
};
