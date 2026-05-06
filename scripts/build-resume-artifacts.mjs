import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { sanitizeResume } from "../src/profile/sanitize-resume.mjs";

const execFileAsync = promisify(execFile);
const humanContactLines = ["415-505-4154", "mundizzle@gmail.com"];
const rootDir = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(rootDir, "data/resume.json");
const publicDir = path.join(rootDir, "public");
const jsonPath = path.join(publicDir, "resume.json");
const markdownPath = path.join(publicDir, "resume.md");
const pdfPath = path.join(publicDir, "resume.pdf");
const namedPdfPath = path.join(publicDir, "mundi-morgado-resume.pdf");
const artifactStatePath = path.join(rootDir, ".resume-artifacts.json");

const rawResume = JSON.parse(await fs.readFile(sourcePath, "utf8"));
const resume = sanitizeResume(rawResume);
const markdown = renderMarkdown(resume);
const html = renderHtml(resume, markdown);

await fs.mkdir(publicDir, { recursive: true });
await fs.writeFile(jsonPath, `${JSON.stringify(resume, null, 2)}\n`);
await fs.writeFile(markdownPath, markdown);
await renderPdf(html);

console.log("resume artifacts built");

async function renderPdf(htmlContent) {
  const sourceHash = sha256(htmlContent);
  const state = await readArtifactState();

  if (state.pdfSourceHash === sourceHash) {
    try {
      await fs.access(pdfPath);
      try {
        await fs.access(namedPdfPath);
      } catch {
        await fs.copyFile(pdfPath, namedPdfPath);
      }
      return;
    } catch {
      // Regenerate below when the tracked PDF is missing.
    }
  }

  const chromePath = await findChrome();

  if (!chromePath) {
    try {
      await fs.access(pdfPath);
      console.warn("Chrome not found; keeping existing public/resume.pdf");
      return;
    } catch {
      throw new Error("Chrome not found and public/resume.pdf does not exist");
    }
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "mundigital-resume-"));
  const htmlPath = path.join(tmpDir, "resume.html");
  const tmpPdfPath = path.join(tmpDir, "resume.pdf");
  await fs.writeFile(htmlPath, htmlContent);

  try {
    await execFileAsync(chromePath, [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      "--print-to-pdf-no-header",
      `--print-to-pdf=${tmpPdfPath}`,
      `file://${htmlPath}`,
    ]);
    await fs.copyFile(tmpPdfPath, pdfPath);
    await fs.copyFile(tmpPdfPath, namedPdfPath);
    await writeArtifactState({ ...state, pdfSourceHash: sourceHash });
  } finally {
    await fs.rm(tmpDir, { force: true, recursive: true });
  }
}

async function readArtifactState() {
  try {
    return JSON.parse(await fs.readFile(artifactStatePath, "utf8"));
  } catch {
    return {};
  }
}

async function writeArtifactState(state) {
  await fs.writeFile(artifactStatePath, `${JSON.stringify(state, null, 2)}\n`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function findChrome() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Continue.
    }
  }

  return null;
}

function renderMarkdown(resume) {
  const lines = [
    `# ${resume.basics.name}`,
    "",
    resume.basics.label,
    "",
    locationLine(resume),
    "",
    "## Summary",
    "",
    resume.basics.summary,
    "",
    "## Skills",
    "",
  ];

  for (const skill of resume.skills ?? []) {
    lines.push(`- **${skill.name}:** ${(skill.keywords ?? []).join(", ")}`);
  }

  lines.push("", "## Experience", "");

  for (const job of resume.work ?? []) {
    lines.push(
      `### ${job.position} — ${job.name}`,
      "",
      formatDateRange(job.startDate, job.endDate),
      "",
      job.summary ?? "",
      "",
    );

    for (const highlight of job.highlights ?? []) {
      lines.push(`- ${highlight}`);
    }

    lines.push("");
  }

  lines.push("## Education", "");

  for (const entry of resume.education ?? []) {
    lines.push(
      `- **${entry.institution}:** ${[entry.studyType, entry.area].filter(Boolean).join(", ")} (${formatDateRange(entry.startDate, entry.endDate)})`,
    );
  }

  if ((resume.references ?? []).length > 0) {
    lines.push("", "## Endorsements", "");

    for (const reference of resume.references ?? []) {
      lines.push(`### ${reference.name}`, "");

      const attribution = [reference.title, reference.company].filter(Boolean).join(" — ");
      if (attribution) {
        lines.push(attribution, "");
      }

      if (reference.reference) {
        lines.push(`> ${reference.reference}`, "");
      }
    }
  }

  return `${lines.filter((line, index, all) => !(line === "" && all[index - 1] === "")).join("\n")}\n`;
}

function renderHtml(resume, markdown) {
  const [nameLine, ...markdownLines] = markdown.split("\n");
  const htmlLines = [
    nameLine,
    "",
    humanContactLines.join(" | "),
    "",
    ...markdownLines,
  ];
  const body = htmlLines
    .map((line) => {
      if (line.startsWith("# ")) {
        return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      }
      if (line.startsWith("## ")) {
        return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      }
      if (line.startsWith("### ")) {
        return `<h3>${escapeHtml(line.slice(4).replace(" — ", " // "))}</h3>`;
      }
      if (line.startsWith("- ")) {
        return `<li>${inlineMarkdown(line.slice(2))}</li>`;
      }
      if (!line.trim()) {
        return "";
      }
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("\n")
    .replace(/(?:<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>\n${match}</ul>\n`);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(resume.basics.name)} Resume</title>
  <style>
    @page { margin: 0.55in; }
    body {
      color: #211d18;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 10.5px;
      line-height: 1.45;
    }
    h1 { font-size: 25px; margin: 0 0 8px; }
    h2 {
      border-top: 1px solid #d8d0c5;
      color: #211d18;
      font-size: 12px;
      letter-spacing: 0.16em;
      margin: 18px 0 8px;
      padding-top: 10px;
      text-transform: uppercase;
    }
    h3 { color: #211d18; font-size: 12px; margin: 12px 0 4px; }
    p { margin: 0 0 6px; }
    ul { margin: 4px 0 8px 18px; padding: 0; }
    li { margin: 0 0 3px; }
    strong { color: #211d18; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function locationLine(resume) {
  return [resume.basics?.location?.city, resume.basics?.location?.region].filter(Boolean).join(", ");
}

function formatDateRange(start, end) {
  return [formatDate(start), formatDate(end)].filter(Boolean).join(" - ");
}

function formatDate(value) {
  if (!value) {
    return "Present";
  }

  const [year, month] = value.split("-");
  if (!month) {
    return year;
  }

  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
