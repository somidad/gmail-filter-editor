import Markdown from "react-markdown";
import readme from "../README.md?raw";
import { Dialog, DialogContent, DialogTrigger } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { HelpCircle } from "lucide-react";
import { H2, H3, UL } from "./components/ui/typography";

export function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <HelpCircle />
        </Button>
      </DialogTrigger>
      {/* https://github.com/shadcn-ui/ui/issues/16#issuecomment-1602565563 */}
      <DialogContent className="max-h-screen overflow-y-scroll">
        <div>
          <Markdown
            components={{
              h2: ({ children }) => <H2>{children}</H2>,
              h3: ({ children }) => <H3>{children}</H3>,
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
      </DialogContent>
    </Dialog>
  );
}
