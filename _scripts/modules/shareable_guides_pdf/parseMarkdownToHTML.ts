import { marked } from "marked";

interface parseMarkdownToHTMLParams {
  markdown: string;
  singleLine?: boolean;
}
export function parseMarkdownToHTML({
  markdown,
  singleLine = false,
}: parseMarkdownToHTMLParams) {
  const html = marked(trimLines(markdown), {
    async: false,
  });
  const hasOnlyOneParagraph = html.match(/<p>/g)?.length === 1;

  if (singleLine && hasOnlyOneParagraph) {
    return html?.replace(/<p>|<\/p>/g, "").trim();
  }

  return html.trim();
}

function trimLines(str: string) {
  return str?.replace(/^ +/gm, "");
}