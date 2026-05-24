import { NextResponse } from "next/server";
import { docsLlmsFullTxt } from "@/lib/docs";

export const dynamic = "force-static";

export function GET() {
  return new NextResponse(docsLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
