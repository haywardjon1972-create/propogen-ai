export type DocSection = {
  title: string;
  body: string;
};

/**
 * Split a generated plain-text proposal into sections for nicer preview UI.
 * Handles numbered headings, ALL-CAPS titles, and ─── separators.
 */
export function parseDocumentSections(text: string): DocSection[] {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const lines = cleaned.split("\n");
  const sections: DocSection[] = [];
  let currentTitle = "Document";
  let currentBody: string[] = [];

  const isSeparator = (line: string) =>
    /^[─\-_=]{4,}\s*$/.test(line.trim()) || line.trim() === "────────────────────────────────────────";

  const isHeading = (line: string) => {
    const t = line.trim();
    if (!t || t.length > 100) return false;
    if (/^\d+[\.\)]\s+\S/.test(t)) return true;
    if (/^[A-Z][A-Z0-9 &/\-]{2,}$/.test(t) && t.split(" ").length <= 10) return true;
    return false;
  };

  const flush = () => {
    const body = currentBody.join("\n").trim();
    if (body || sections.length === 0) {
      sections.push({ title: currentTitle, body });
    }
    currentBody = [];
  };

  for (const line of lines) {
    if (isSeparator(line)) continue;
    if (isHeading(line) && currentBody.some((l) => l.trim())) {
      flush();
      currentTitle = line.trim().replace(/^[─\-_\s]+|[─\-_\s]+$/g, "");
      continue;
    }
    // First non-empty line as title if still on default Document with empty body
    if (
      currentTitle === "Document" &&
      currentBody.length === 0 &&
      line.trim() &&
      isHeading(line)
    ) {
      currentTitle = line.trim();
      continue;
    }
    currentBody.push(line);
  }
  flush();

  // If we only got one blob, still return it
  if (sections.length === 1 && !sections[0].body && sections[0].title) {
    return [{ title: "Document", body: sections[0].title }];
  }

  return sections.filter((s) => s.body || s.title);
}

export function slugifyFilename(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "document"
  );
}
