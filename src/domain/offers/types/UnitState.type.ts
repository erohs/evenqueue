/**
 * free: available to offer; offered: waiting for the buyer to claim; pending: claimed, waiting for payment;
 * sold; held: a late payment under review; retired: removed after a refund; withdrawn: taken out by the vendor.
 */
export type UnitState = "free" | "offered" | "pending" | "sold" | "held" | "retired" | "withdrawn";
