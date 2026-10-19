import { createServer } from "node:http";
import { handleBuyerRequest } from "#web/routes/functions/handleBuyerRequest.function.ts";
import { createDevelopmentServices } from "./functions/createDevelopmentServices.function.ts";
import { sendWebResponse } from "./functions/sendWebResponse.function.ts";
import { stylesheetResponse } from "./functions/stylesheetResponse.function.ts";
import { toWebRequest } from "./functions/toWebRequest.function.ts";

const port = Number(process.env["PORT"] ?? 8787);
const origin = `http://localhost:${port}`;
const { services, drop } = await createDevelopmentServices();
const dropAddress = `${origin}/d/${drop.dropId}`;

createServer((incoming, outgoing) => {
    const request = toWebRequest(incoming, origin);
    const pathname = new URL(request.url).pathname;
    const clientAddress = incoming.socket.remoteAddress ?? "unknown";
    const respond = async (): Promise<Response> =>
        pathname === "/"
            ? Response.redirect(dropAddress, 303)
            : ((await stylesheetResponse(pathname)) ?? handleBuyerRequest(request, { services, clientAddress }));
    respond()
        .then((response) => sendWebResponse(response, outgoing))
        .catch((error: unknown) => {
            console.error(error);
            outgoing.writeHead(500).end("Something went wrong; see the server log.");
        });
}).listen(port, () => console.log(`Development server, in memory only: ${dropAddress}`));
