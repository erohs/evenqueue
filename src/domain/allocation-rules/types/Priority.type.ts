/**
 * Who is offered first: higher first. A whole number that fits in 32 signed bits, because commitments publish it in
 * four bytes. Made only by toPriority.
 */
export type Priority = number & { readonly brand: "Priority" };
