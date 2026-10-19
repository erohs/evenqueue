/** `/d/{dropId}` and what follows it; a drop id is exactly 64 lower-case hex characters. */
export const dropPathPattern = /^\/d\/([0-9a-f]{64})((?:\/[a-z]+)*)$/u;
