import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import { parseDocumentSections, slugifyFilename } from "./documentFormat";

export async function downloadAsDocx(
  text: string,
  options?: { filenameBase?: string; title?: string },
): Promise<void> {
  const sections = parseDocumentSections(text);
  const children: Paragraph[] = [];

  if (options?.title) {
    children.push(
      new Paragraph({
        text: options.title,
        heading: HeadingLevel.TITLE,
        spacing: { after: 200 },
      }),
    );
  }

  for (const section of sections) {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
      }),
    );

    const bodyLines = section.body.split("\n");
    for (const line of bodyLines) {
      const trimmed = line.trimEnd();
      if (!trimmed.trim()) {
        children.push(new Paragraph({ text: "" }));
        continue;
      }
      const isBullet = /^[•\-\*]\s+/.test(trimmed.trim());
      const content = isBullet
        ? trimmed.trim().replace(/^[•\-\*]\s+/, "")
        : trimmed;

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: content,
              size: 22, // 11pt
              font: "Calibri",
            }),
          ],
          bullet: isBullet ? { level: 0 } : undefined,
          spacing: { after: 80 },
          alignment: AlignmentType.LEFT,
        }),
      );
    }
  }

  if (children.length === 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text, size: 22, font: "Calibri" })],
      }),
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const base = slugifyFilename(options?.filenameBase || options?.title || "propogen");
  saveAs(blob, `${base}-${Date.now()}.docx`);
}
