import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDir = path.join(appDir, "storybook-static");
const args = process.argv.slice(2);
const includeTagsIndex = args.indexOf("--includeTags");
const includeTags = includeTagsIndex >= 0 ? args[includeTagsIndex + 1] : undefined;
const labelIndex = args.indexOf("--label");
const label = labelIndex >= 0 ? args[labelIndex + 1] : "storybook";

function run(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      cwd: appDir,
      stdio: "inherit",
      env: {
        ...process.env,
        CI: "true",
      },
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${commandArgs.join(" ")} exited with ${code}`));
    });
  });
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".ico")) return "image/x-icon";
  return "application/octet-stream";
}

function serveStatic() {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const decodedPath = decodeURIComponent(requestUrl.pathname);
    const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
    const filePath = path.normalize(path.join(staticDir, relativePath));

    if (!filePath.startsWith(staticDir)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const resolvedPath = fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
      ? path.join(filePath, "index.html")
      : filePath;

    fs.readFile(resolvedPath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, { "Content-Type": contentType(resolvedPath) });
      response.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("Unable to determine Storybook test server address");
      }
      resolve({
        close: () => new Promise((closeResolve) => server.close(closeResolve)),
        url: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

await run("pnpm", ["exec", "storybook", "build", "--output-dir", staticDir]);

const server = await serveStatic();

try {
  console.log(`Running ${label} Storybook tests at ${server.url}`);
  const testArgs = ["exec", "test-storybook", "--url", server.url, "--index-json", "--ci"];
  if (includeTags) {
    testArgs.push("--includeTags", includeTags);
  }
  await run("pnpm", testArgs);
} finally {
  await server.close();
}
