import {
  CATEGORY_LABELS,
  IMPORTANT,
  INBOX,
  SPAM,
  STARRED,
  TRASH,
  UNREAD,
} from "./labels";
import { findAndPop } from "./array";

export type Action = {
  addLabelIds?: string[];
  removeLabelIds?: string[];
  forward?: string;
};

export type ParsedAction = {
  skipInbox: boolean;
  markAsRead: boolean;
  star: boolean;
  labelToAdd?: string;
  forward: string;
  deleteIt: boolean;
  notSpam: boolean;
  alwaysMarkAsImportant: boolean;
  neverMarkAsImportant: boolean;
  categorize?: string;
};

export const ActionDescription: Record<keyof ParsedAction, string> = {
  skipInbox: "Skip the inbox",
  markAsRead: "Mark as read",
  star: "Star it",
  labelToAdd: "Apply the label",
  forward: "Forward it to",
  deleteIt: "Delete it",
  notSpam: "Never send it to Spam",
  alwaysMarkAsImportant: "Always mark it as important",
  neverMarkAsImportant: "Never mark it as important",
  categorize: "Categorize as",
};

export function parseAction(action: Action): ParsedAction {
  const addLabelIds = [...(action.addLabelIds ?? [])];
  const removeLabelIds = [...(action.removeLabelIds ?? [])];
  const forward = action.forward ?? "";

  const skipInbox = removeLabelIds.includes(INBOX);
  const markAsRead = removeLabelIds.includes(UNREAD);
  const star = !!findAndPop(addLabelIds, STARRED);
  const deleteIt = !!findAndPop(addLabelIds, TRASH);
  const notSpam = removeLabelIds.includes(SPAM);
  const alwaysMarkAsImportant = !!findAndPop(addLabelIds, IMPORTANT);
  const neverMarkAsImportant = removeLabelIds.includes(IMPORTANT);
  let categorize: string | undefined;
  Object.keys(CATEGORY_LABELS).forEach((id) => {
    if (categorize) {
      return;
    }
    categorize = findAndPop(addLabelIds, id);
  });
  const labelToAdd = addLabelIds[0];

  return {
    skipInbox,
    markAsRead,
    star,
    labelToAdd,
    forward,
    deleteIt,
    notSpam,
    alwaysMarkAsImportant,
    neverMarkAsImportant,
    categorize,
  };
}
