"use client";

import { parseDocumentSections } from "@/lib/documentFormat";

type Props = {
  text: string;
};

export default function DocumentPreview({ text }: Props) {
  const sections = parseDocumentSections(text);

  if (sections.length <= 1) {
    return (
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
        {text}
      </pre>
    );
  }

  return (
    <div className="space-y-5">
      {sections.map((section, i) => (
        <article key={`${section.title}-${i}`} className="space-y-2">
          <h4 className="border-b border-border pb-1.5 text-sm font-semibold tracking-tight text-foreground">
            {section.title}
          </h4>
          <div className="space-y-1.5 text-sm leading-relaxed text-foreground/90">
            {section.body.split("\n").map((line, j) => {
              const t = line.trim();
              if (!t) return <div key={j} className="h-2" />;
              if (/^[•\-\*]\s+/.test(t)) {
                return (
                  <p key={j} className="pl-1">
                    <span className="mr-2 text-primary">•</span>
                    {t.replace(/^[•\-\*]\s+/, "")}
                  </p>
                );
              }
              return (
                <p key={j} className="text-foreground/90">
                  {line}
                </p>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
