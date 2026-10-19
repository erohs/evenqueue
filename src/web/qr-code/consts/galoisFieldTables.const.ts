import type { IGaloisFieldTables } from "../interfaces/IGaloisFieldTables.ts";

/** GF(256) with the QR reducing polynomial x⁸ + x⁴ + x³ + x² + 1 (0x11d) and generator α = 2. */
const buildTables = (): IGaloisFieldTables => {
    const exponents: number[] = [];
    const logarithms: number[] = Array.from({ length: 256 }, () => 0);
    let value = 1;
    for (let power = 0; power < 255; power++) {
        exponents.push(value);
        logarithms[value] = power;
        value = value & 0x80 ? ((value << 1) ^ 0x11d) & 0xff : value << 1;
    }
    return { exponents: [...exponents, ...exponents], logarithms };
};

export const galoisFieldTables: IGaloisFieldTables = buildTables();
