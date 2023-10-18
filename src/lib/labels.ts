export const IMPORTANT = "IMPORTANT";
export const INBOX = "INBOX";
export const SPAM = "SPAM";
export const STARRED = "STARRED";
export const TRASH = "TRASH";
export const UNREAD = "UNREAD";

export const CATEGORY_LABELS = {
  CATEGORY_PRIMARY: "Personal",
  CATEGORY_SOCIAL: "Social",
  CATEGORY_UPDATES: "Updates",
  CATEGORY_FORUM: "Forum",
  CATEGORy_PROMOTIONS: "Promotions",
};

export type Label = {
  id: string;
  name: string;
};
