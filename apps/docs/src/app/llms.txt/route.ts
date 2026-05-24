import { NextResponse } from "next/server";
import { docsLlmsTxt } from "@/lib/docs";

export const dynamic = "force-static";

export function GET() {
  return new NextResponse(docsLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
