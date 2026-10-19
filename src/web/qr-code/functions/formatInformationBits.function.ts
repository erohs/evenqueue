/**
 * The 15 format bits for level M (its indicator is 00) and `mask`: five data bits, ten BCH(15,5) check bits from the
 * generator 0x537, all masked with 0x5412 so the bits are never all light.
 */
export const formatInformationBits = (mask: number): number => {
    const data = mask;
    let remainder = data;
    for (let i = 0; i < 10; i++) remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);
    return ((data << 10) | remainder) ^ 0x5412;
};
