import { z } from "zod";
import {
  STARRED,
  TRASH,
  IMPORTANT,
  CATEGORY_ID_NAMES,
  INBOX,
  UNREAD,
  SPAM,
} from "./labels";

export const Action = z.object({
  addLabelIds: z.array(z.string()).default([]),
  removeLabelIds: z.array(z.string()).default([]),
  forward: z.string().default(""),
});

export const ParsedAction = z.object({
  skipInbox: z.boolean().default(false),
  markAsRead: z.boolean().default(false),
  star: z.boolean().default(false),
  label: z.string().default(""),
  forward: z.string().default(""),
  deleteIt: z.boolean().default(false),
  notSpam: z.boolean().default(false),
  important: z.boolean().default(false),
  notImportant: z.boolean().default(false),
  category: z.string().default(""),
});

export const ActionInput = z.object({
  archiveOrDelete: z
    .array(z.enum(["skipInbox", "deleteIt"]))
    .max(1, {
      message:
        "'Skip the inbox (Archive it)' and 'Delete it' cannot be set together.",
    })
    .default([]),
  markAsRead: z.boolean().default(false),
  star: z.boolean().default(false),
  label: z.string().default(""),
  forward: z.string().default(""),
  notSpam: z.boolean().default(false),
  importantOrNot: z
    .array(z.enum(["important", "notImportant"]))
    .max(1, {
      message:
        "'Always mark it as important' and 'Never mark it as important' cannot be set together.",
    })
    .default([]),
  category: z.string().default(""),
});

export const ActionLabel: Record<keyof z.infer<typeof ParsedAction>, string> = {
  skipInbox: "Skip the inbox (Archive it)",
  markAsRead: "Mark as read",
  star: "Star it",
  label: "Apply the label",
  forward: "Forward it to",
  deleteIt: "Delete it",
  notSpam: "Never send it to Spam",
  important: "Always mark it as important",
  notImportant: "Never mark it as important",
  category: "Categorize as",
};

export function parseAction(
  action: z.infer<typeof Action>
): z.infer<typeof ParsedAction> {
  const addLabelIds = [...(action.addLabelIds ?? [])];
  const removeLabelIds = [...(action.removeLabelIds ?? [])];
  const forward = action.forward ?? "";

  const parsedAction: z.infer<typeof ParsedAction> = {
    skipInbox: false,
    markAsRead: false,
    star: false,
    label: "",
    forward,
    deleteIt: false,
    notSpam: false,
    important: false,
    notImportant: false,
    category: "",
  };

  addLabelIds.forEach((label) => {
    if (label === STARRED) {
      parsedAction.star = true;
      return;
    }
    if (label === TRASH) {
      parsedAction.deleteIt = true;
      return;
    }
    if (label === IMPORTANT) {
      parsedAction.important = true;
      return;
    }
    if (label in CATEGORY_ID_NAMES) {
      parsedAction.category = label;
      return;
    }
    parsedAction.label = label;
  });
  removeLabelIds.forEach((label) => {
    if (label === INBOX) {
      parsedAction.skipInbox = true;
      return;
    }
    if (label === UNREAD) {
      parsedAction.markAsRead = true;
      return;
    }
    if (label === SPAM) {
      parsedAction.notSpam = true;
      return;
    }
    if (label === IMPORTANT) {
      parsedAction.notImportant = true;
      return;
    }
  });

  return parsedAction;
}
