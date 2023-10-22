import { z } from "zod";

export const IMPORTANT = "IMPORTANT";
export const INBOX = "INBOX";
export const SPAM = "SPAM";
export const STARRED = "STARRED";
export const TRASH = "TRASH";
export const UNREAD = "UNREAD";

export const CATEGORY_ID_NAMES = {
  CATEGORY_PERSONAL: "Personal",
  CATEGORY_SOCIAL: "Social",
  CATEGORY_UPDATES: "Updates",
  CATEGORY_FORUMS: "Forums",
  CATEGORY_PROMOTIONS: "Promotions",
} as const;

export const Label = z.object({
  id: z.string(),
  name: z.string(),
});
