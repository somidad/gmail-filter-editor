import Markdown from "react-markdown";
import { H3, H4, UL } from "@/components/ui/typography";
import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { BackButton } from "@/components/BackButton";

export default async function Help() {
  const content = readFileSync(join(cwd(), 'public', 'README.md'), 'utf-8');
  
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <BackButton />
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
        {content}
      </Markdown>
    </div>
  );
}
