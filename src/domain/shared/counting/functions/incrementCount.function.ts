import type { Count } from "../types/Count.type.ts";
import { toCount } from "./toCount.function.ts";

export const incrementCount = (count: Count): Count => toCount(count + 1);
