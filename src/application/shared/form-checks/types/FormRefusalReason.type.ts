import type { FormTokenReading } from "#domain/form-guard/types/FormTokenReading.type.ts";

/** Each one means "show a fresh form and ask the buyer to confirm", never "turn them away". */
export type FormRefusalReason = Exclude<FormTokenReading["kind"], "accepted"> | "honeypot-filled";
