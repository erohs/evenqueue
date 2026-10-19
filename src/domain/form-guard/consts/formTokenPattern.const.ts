/** `nonce.issuedAt.signature`: 16 bytes of hex, a time in milliseconds and 32 bytes of hex. */
export const formTokenPattern = /^([0-9a-f]{32})\.(0|[1-9][0-9]{0,15})\.([0-9a-f]{64})$/u;
