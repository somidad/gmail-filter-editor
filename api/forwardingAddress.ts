import { z } from "zod";

export const ForwardingAddresss = z.object({
  forwardingEmail: z.string().min(1),
  verificationStatus: z.enum([
    "verificationStatusUnspecified",
    "accepted",
    "pending",
  ]),
});
