import Markdown from "react-markdown";
import readme from "../README.md?raw";
import { H3, H4, UL } from "./components/ui/typography";
import { Button } from "./components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Help() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => window.location.assign("/#")}>
          <ArrowLeft />
        </Button>
      </div>
      <Markdown
        components={{
          h2: ({ children }) => <H3>{children}</H3>,
          h3: ({ children }) => <H4>{children}</H4>,
          ul: ({ children }) => <UL>{children}</UL>,
          a: ({ children, ...props }) => (
            <a className="underline" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {readme}
      </Markdown>
    </div>
  );
}
