import Markdown from "react-markdown";
import privacy from "../privacy.md?raw";
import { H3, UL } from "./components/ui/typography";
import { Button } from "./components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Privacy() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => window.location.assign("/")}>
          <ArrowLeft />
        </Button>
      </div>
      <Markdown
        components={{
          h2: ({ children }) => <H3>{children}</H3>,
          ul: ({ children }) => <UL>{children}</UL>,
        }}
      >
        {privacy}
      </Markdown>
    </div>
  );
}
