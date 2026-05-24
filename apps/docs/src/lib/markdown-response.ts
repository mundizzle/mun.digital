import { NextResponse } from "next/server";
import { getPage, readPageMarkdown } from "./docs";

export function markdownResponse(slug: string) {
  const page = getPage(slug);

  if (!page) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(readPageMarkdown(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
