export type Criteria = {
  from?: string;
  to?: string;
  subject?: string;
  query?: string;
  negatedQuery?: string;
  hasAttachment?: boolean;
  excludeChats?: boolean;
  size?: number;
  sizeComparison?: "larger" | "smaller";
};

export type ParsedCriteria = {
  from: string;
  to: string;
  subject: string;
  query: string;
  negatedQuery: string;
  hasAttachment: boolean;
  excludeChats: boolean;
  smaller: number;
  larger: number;
};

export const CriteriaDescription: Record<keyof ParsedCriteria, string> = {
  from: "From",
  to: "To",
  subject: "Subject",
  query: "Has the words",
  negatedQuery: "Doesn't have",
  hasAttachment: "Has attachment",
  excludeChats: "Don't include chats",
  smaller: "Smaller",
  larger: "Larger",
};

export function parseCriteria(criteria: Criteria) {
  const from = criteria.from ?? "";
  const to = criteria.to ?? "";
  const subject = criteria.subject ?? "";
  const query = criteria.query ?? "";
  const negatedQuery = criteria.negatedQuery ?? "";
  const hasAttachment = criteria.hasAttachment ?? false;
  const excludeChats = criteria.excludeChats ?? false;
  const smaller =
    criteria.sizeComparison === "smaller" ? criteria.size : undefined;
  const larger =
    criteria.sizeComparison === "larger" ? criteria.size : undefined;

  return {
    from,
    to,
    subject,
    query,
    negatedQuery,
    hasAttachment,
    excludeChats,
    smaller,
    larger,
  };
}
