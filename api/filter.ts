import { z } from "zod";
import { Criteria } from "./criteria";
import { Action } from "./action";

export const Filter = z.object({
  id: z.string().min(1),
  criteria: Criteria,
  action: Action,
});
