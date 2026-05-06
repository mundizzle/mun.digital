import { NextResponse, type NextRequest } from "next/server";

const proxyBypassHeader = "x-mundigital-proxy-bypass";

export async function proxy(request: NextRequest) {
  if (request.headers.has(proxyBypassHeader) || !["GET", "HEAD"].includes(request.method)) {
    return NextResponse.next();
  }

  const accept = request.headers.get("accept") ?? "";
  const target = prefersMarkdown(accept) ? "/resume.md" : "/";
  const upstream = await fetchWithBypass(request, target);
  const headers = new Headers(upstream.headers);
  stripHopByHop(headers);
  appendVary(headers, "Accept");

  if (target === "/resume.md") {
    headers.set("Link", '<https://mun.digital/resume.md>; rel="canonical"');
  }

  return new NextResponse(upstream.body, {
    headers,
    status: upstream.status,
    statusText: upstream.statusText,
  });
}

export const config = {
  matcher: "/",
};

type MediaPreference = {
  mediaType: string;
  q: number;
};

function fetchWithBypass(request: NextRequest, pathname: string) {
  const url = new URL(pathname, request.url);
  const headers = new Headers(request.headers);
  headers.set(proxyBypassHeader, "1");

  return fetch(url, {
    headers,
    method: request.method,
  });
}

function prefersMarkdown(accept: string) {
  const preferences = parseAccept(accept);
  const markdown = preferences.find((item) => item.mediaType === "text/markdown");

  if (!markdown || markdown.q <= 0) {
    return false;
  }

  const html = preferences.find((item) => item.mediaType === "text/html");
  return !html || markdown.q >= html.q;
}

function parseAccept(accept: string): MediaPreference[] {
  return accept
    .split(",")
    .map((part) => {
      const [rawMediaType, ...params] = part.split(";").map((value) => value.trim());
      const mediaType = rawMediaType.toLowerCase();
      const qParam = params.find((param) => param.toLowerCase().startsWith("q="));
      const q = qParam ? Number(qParam.slice(2)) : 1;

      return {
        mediaType,
        q: Number.isFinite(q) ? Math.min(Math.max(q, 0), 1) : 1,
      };
    })
    .filter((item) => item.mediaType.length > 0);
}

function stripHopByHop(headers: Headers) {
  for (const header of [
    "connection",
    "content-encoding",
    "content-length",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
  ]) {
    headers.delete(header);
  }
}

function appendVary(headers: Headers, value: string) {
  const existing = headers.get("Vary");

  if (!existing) {
    headers.set("Vary", value);
    return;
  }

  const values = existing.split(",").map((item) => item.trim().toLowerCase());
  if (!values.includes(value.toLowerCase())) {
    headers.set("Vary", `${existing}, ${value}`);
  }
}
