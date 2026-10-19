import type { IBeaconChain } from "../interfaces/IBeaconChain.ts";

/** drand quicknet, as both public endpoints reported it on 2026-10-19. Never replaced by another randomness source. */
export const quicknetBeaconChain: IBeaconChain = {
    chainHash: "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
    schemeId: "bls-unchained-g1-rfc9380",
    publicKey:
        "83cf0f2896adee7eb8b5f01fcad3912212c437e0073e911fb90022d3e760183c8c4b450b6a0a6c3ac6a5776a2d1064510d1fec758c921cc22b0e17e63aaf4bcb5ed66304de9cf809bd274ca73bab4af5a6e9c76a4bc09e76eae8991ef5ece45a",
    genesisTime: 1_692_803_367_000,
    period: 3_000,
};
