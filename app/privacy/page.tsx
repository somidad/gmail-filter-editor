'use client'

import Markdown from "react-markdown";
import { H3, H4, UL } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function Privacy() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/PRIVACY.md').then((res) => res.text()).then((text) => setContent(text));
  }, [])
  
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => history.back()}>
          <ArrowLeft />
        </Button>
      </div>
      <Markdown
        components={{
          h2: ({ children }) => <H3>{children}</H3>,
          h3: ({ children }) => <H4>{children}</H4>,
          ul: ({ children }) => <UL>{children}</UL>,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
