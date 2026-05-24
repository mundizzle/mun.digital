const baseUrl = new URL(process.argv[2] ?? "https://mun.digital");

await assertMarkdownNegotiation(baseUrl);
await assertHtmlNegotiation(baseUrl);
await assertWildcardDefaultsToHtml(baseUrl);
await assertLlmsTxt(baseUrl);
await assertResumeMarkdown(baseUrl);

console.log(`llms smoke passed: ${baseUrl.href}`);

async function assertMarkdownNegotiation(base) {
  const response = await fetch(new URL("/", base), {
    headers: { Accept: "text/markdown" },
  });
  const body = await response.text();

  assert(response.ok, "markdown negotiation did not return 200");
  assert(
    headerStartsWith(response, "content-type", "text/markdown"),
    "markdown negotiation did not return text/markdown",
  );
  assert(headerIncludes(response, "vary", "accept"), "markdown negotiation missing Vary: Accept");
  assert(body.startsWith("# Mundi Morgado"), "markdown negotiation body did not start with resume markdown");
}

async function assertHtmlNegotiation(base) {
  const response = await fetch(new URL("/", base), {
    headers: { Accept: "text/html,application/xhtml+xml" },
  });
  const body = await response.text();

  assert(response.ok, "html negotiation did not return 200");
  assert(
    headerStartsWith(response, "content-type", "text/html"),
    "html negotiation did not return text/html",
  );
  assert(headerIncludes(response, "vary", "accept"), "html negotiation missing Vary: Accept");
  assert(body.includes("<html"), "html negotiation body did not include html document");
}

async function assertWildcardDefaultsToHtml(base) {
  const response = await fetch(new URL("/", base), {
    headers: { Accept: "*/*" },
  });

  assert(response.ok, "wildcard negotiation did not return 200");
  assert(
    headerStartsWith(response, "content-type", "text/html"),
    "Accept: */* should return text/html",
  );
}

async function assertLlmsTxt(base) {
  const response = await fetch(new URL("/llms.txt", base));
  const body = await response.text();

  assert(response.ok, "llms.txt did not return 200");
  assert(body.startsWith("# mundigital"), "llms.txt missing title");
  for (const expected of ["/resume.md", "/resume.json", "/mundi-morgado-resume.pdf", "/api/mcp"]) {
    assert(body.includes(expected), `llms.txt missing ${expected}`);
  }
  assert(body.includes("https://github.com/mundizzle"), "llms.txt missing GitHub profile");
  for (const expected of ["mundigital", "search", "brief", "fetch", "Claude", "Codex", "https://mun.digital/api/mcp"]) {
    assert(body.includes(expected), `llms.txt missing ${expected}`);
  }
}

async function assertResumeMarkdown(base) {
  const response = await fetch(new URL("/resume.md", base));
  const body = await response.text();

  assert(response.ok, "resume.md did not return 200");
  assert(
    headerStartsWith(response, "content-type", "text/markdown"),
    "resume.md did not return text/markdown",
  );
  assert(body.startsWith("# Mundi Morgado"), "resume.md body did not start with resume markdown");
  assert(body.includes("github.com/mundizzle"), "resume.md is missing GitHub profile");
}

function headerStartsWith(response, name, expected) {
  return response.headers.get(name)?.toLowerCase().startsWith(expected) ?? false;
}

function headerIncludes(response, name, expected) {
  return (
    response.headers
      .get(name)
      ?.split(",")
      .map((value) => value.trim().toLowerCase())
      .includes(expected) ?? false
  );
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
