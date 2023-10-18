import { CSSProperties, useRef, useState } from "react";
import { Filter } from "./lib/filter";
import {
  CATEGORY_LABELS,
  IMPORTANT,
  INBOX,
  Label,
  SPAM,
  STARRED,
  TRASH,
  UNREAD,
} from "./lib/labels";

type Props = {
  labels: Label[];
  open: boolean;
  onOpenChange: (opened: boolean) => void;
  onSave: (filter: Omit<Filter, "id">) => void;
};

const INPUT_STYLE: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const CHECKBOX_STYLE: CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
};

export function FilterAddModModal({
  labels,
  open,
  onOpenChange,
  onSave,
}: Props) {
  const refFrom = useRef<HTMLInputElement>(null);
  const refTo = useRef<HTMLInputElement>(null);
  const refSubject = useRef<HTMLInputElement>(null);
  const refQuery = useRef<HTMLInputElement>(null);
  const refNegatedQuery = useRef<HTMLInputElement>(null);
  const refSizeComparison = useRef<HTMLSelectElement>(null);
  const refSize = useRef<HTMLInputElement>(null);
  const refHasAttachment = useRef<HTMLInputElement>(null);
  const refExcludeChats = useRef<HTMLInputElement>(null);

  const refSkipInbox = useRef<HTMLInputElement>(null);
  const refMarkAsRead = useRef<HTMLInputElement>(null);
  const refStar = useRef<HTMLInputElement>(null);
  const [applyLabel, setApplyLabel] = useState(false);
  const refLabel = useRef<HTMLSelectElement>(null);
  const refDelete = useRef<HTMLInputElement>(null);
  const refNotSpam = useRef<HTMLInputElement>(null);
  const [important, setImportant] = useState(false);
  const [notImportant, setNotImportant] = useState(false);
  const [categorize, setCategorize] = useState(false);
  const refCategory = useRef<HTMLSelectElement>(null);

  function submit() {
    const from = refFrom.current?.value;
    const to = refTo.current?.value;
    const subject = refSubject.current?.value;
    const query = refQuery.current?.value;
    const negatedQuery = refNegatedQuery.current?.value;
    const sizeComparison = refSizeComparison.current?.value;
    const size = Number(refSize.current?.value);
    const sizeApplicable =
      Number.isFinite(size) &&
      size > 0 &&
      (sizeComparison === "larger" || sizeComparison === "smaller");
    const hasAttachment = refHasAttachment.current?.checked;
    const excludeChats = refExcludeChats.current?.checked;

    const addLabelIds: string[] = [];
    const removeLabelIds: string[] = [];
    if (refSkipInbox.current?.checked) {
      removeLabelIds.push(INBOX);
    }
    if (refMarkAsRead.current?.checked) {
      removeLabelIds.push(UNREAD);
    }
    if (refStar.current?.checked) {
      addLabelIds.push(STARRED);
    }
    const label = refLabel.current?.value;
    if (applyLabel && label) {
      addLabelIds.push(label);
    }
    if (refDelete.current?.checked) {
      addLabelIds.push(TRASH);
    }
    if (refNotSpam.current?.checked) {
      removeLabelIds.push(SPAM);
    }
    if (important) {
      addLabelIds.push(IMPORTANT);
    }
    if (notImportant) {
      removeLabelIds.push(IMPORTANT);
    }
    const category = refCategory.current?.value;
    if (categorize && category) {
      addLabelIds.push(category);
    }

    const filter: Omit<Filter, "id"> = {
      criteria: {
        from,
        to,
        subject,
        query,
        negatedQuery,
        hasAttachment,
        excludeChats,
        sizeComparison: sizeApplicable ? sizeComparison : undefined,
        size: sizeApplicable ? size | 0 : undefined,
      },
      action: {
        addLabelIds,
        removeLabelIds,
      },
    };
    onSave(filter);
  }

  return (
    <dialog open={open}>
      <header>
        <h3>Add filter</h3>
      </header>
      <div>
        <div style={{ marginBottom: "0.5em" }}>
          <b>Criteria</b>
        </div>
        <div style={INPUT_STYLE}>
          <label>From</label>
          <input ref={refFrom} />
        </div>
        <div style={INPUT_STYLE}>
          <label>To</label>
          <input ref={refTo} />
        </div>
        <div style={INPUT_STYLE}>
          <label>Subject</label>
          <input ref={refSubject} />
        </div>
        <div style={INPUT_STYLE}>
          <label>Has the words</label>
          <input ref={refQuery} />
        </div>
        <div style={INPUT_STYLE}>
          <label>Doesn't have</label>
          <input ref={refNegatedQuery}></input>
        </div>
        <div style={INPUT_STYLE}>
          <select ref={refSizeComparison}>
            <option value="">Select comparator</option>
            <option value="larger">greater than</option>
            <option value="smaller">less than</option>
          </select>
          <input ref={refSize} />
          Bytes
        </div>
        <div style={CHECKBOX_STYLE}>
          <input type="checkbox" ref={refHasAttachment}></input>
          <label>Has attachment</label>
        </div>
        <div style={CHECKBOX_STYLE}>
          <input type="checkbox" ref={refExcludeChats}></input>
          <label>Don't include chats</label>
        </div>
      </div>
      <div style={{ marginTop: "0.5em" }}>
        <div style={{ marginBottom: "0.5em" }}>
          <b>Actions</b>
        </div>
        <div style={CHECKBOX_STYLE}>
          <input type="checkbox" ref={refSkipInbox} />
          <label>Skip the Inbox (Archive it)</label>
        </div>
        <div style={CHECKBOX_STYLE}>
          <input type="checkbox" ref={refMarkAsRead} />
          <label>Mark as read</label>
        </div>
        <div style={CHECKBOX_STYLE}>
          <input type="checkbox" ref={refStar} />
          <label>Star it</label>
        </div>
        <div style={INPUT_STYLE}>
          <span style={CHECKBOX_STYLE}>
            <input
              type="checkbox"
              checked={applyLabel}
              onChange={(e) => setApplyLabel(e.target.checked)}
            />
            <label>Apply the label:</label>
          </span>
          <select ref={refLabel} disabled={!applyLabel}>
            <option value="">Select label</option>
            {labels.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div style={CHECKBOX_STYLE}>
          <input type="checkbox" ref={refDelete} />
          <label>Delete it</label>
        </div>
        <div style={CHECKBOX_STYLE}>
          <input type="checkbox" ref={refNotSpam} />
          <label>Never send it to Spam</label>
        </div>
        <div style={CHECKBOX_STYLE}>
          <input
            type="checkbox"
            disabled={notImportant}
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
          />
          <label>Always mark it as important</label>
        </div>
        <div style={CHECKBOX_STYLE}>
          <input
            type="checkbox"
            disabled={important}
            checked={notImportant}
            onChange={(e) => setNotImportant(e.target.checked)}
          />
          <label>Never mark it as important</label>
        </div>
        <div style={INPUT_STYLE}>
          <span style={CHECKBOX_STYLE}>
            <input
              type="checkbox"
              checked={categorize}
              onChange={(e) => setCategorize(e.target.checked)}
              defaultChecked={!!categorize}
            />
            <label>Categorize as:</label>
          </span>
          <select ref={refCategory} disabled={!categorize}>
            <option value="">Select category</option>
            {Object.entries(CATEGORY_LABELS).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <footer
        style={{
          marginTop: "1em",
          marginBottom: "1em",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1em",
        }}
      >
        <a href="#" onClick={() => onOpenChange(false)}>
          Cancel
        </a>
        <a href="#" onClick={submit}>
          Add
        </a>
      </footer>
    </dialog>
  );
}
