import { z } from "zod";

export const Criteria = z.object({
  from: z.string().default(""),
  to: z.string().default(""),
  subject: z.string().default(""),
  query: z.string().default(""),
  negatedQuery: z.string().default(""),
  hasAttachment: z.boolean().default(false),
  excludeChats: z.boolean().default(false),
  size: z.coerce.number().int().min(0).default(0),
  sizeComparison: z
    .enum(["unspecified", "larger", "smaller"])
    .default("unspecified"),
});

export const CriteriaLabel: Record<
  keyof Omit<z.infer<typeof Criteria>, "size" | "sizeComparison">,
  string
> = {
  from: "From",
  to: "To",
  subject: "Subject",
  query: "Has the words",
  negatedQuery: "Doesn't have",
  hasAttachment: "Has attachment",
  excludeChats: "Don't include chats",
};
