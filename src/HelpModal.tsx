import Markdown from "react-markdown";
import readme from "../README.md?raw";

type Props = {
  open: boolean;
  onOpenChange: (opened: boolean) => void;
};

export function HelpModal({ open, onOpenChange }: Props) {
  return (
    <dialog open={open}>
      <div>
        <Markdown>{readme}</Markdown>
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
          Close
        </a>
      </footer>
    </dialog>
  );
}
