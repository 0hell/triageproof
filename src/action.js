import { appendFile, readFile } from "node:fs/promises";
import { analyzeIssue } from "./analyzer.js";
import { renderMarkdown } from "./report.js";

const MAX_EVENT_BYTES = 1024 * 1024;

async function appendKeyValue(path, key, value) {
  if (!path) return;
  await appendFile(path, `${key}=${String(value).replace(/\r?\n/g, " ")}\n`, "utf8");
}

async function run() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error("GITHUB_EVENT_PATH is not set");

  const eventBytes = await readFile(eventPath);
  if (eventBytes.length > MAX_EVENT_BYTES) throw new Error("GitHub event file exceeds the safety limit");
  const event = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(eventBytes));
  const body = event.issue?.body ?? event.pull_request?.body;
  if (typeof body !== "string") throw new Error("The event does not contain an issue or pull request body");

  const result = analyzeIssue(body);
  const report = renderMarkdown(result);

  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, report, "utf8");
  } else {
    process.stdout.write(report);
  }

  await appendKeyValue(process.env.GITHUB_OUTPUT, "status", result.status);
  await appendKeyValue(process.env.GITHUB_OUTPUT, "score", result.score);
  await appendKeyValue(process.env.GITHUB_OUTPUT, "potential-secrets", result.security.potentialSecrets);

  const mode = (process.env.INPUT_MODE ?? "advisory").toLowerCase();
  if (mode === "strict") {
    if (result.status === "blocked") process.exitCode = 2;
    else if (result.status === "needs-info") process.exitCode = 1;
  }
}

run().catch((error) => {
  process.stderr.write(`TriageProof action failed: ${error.message}\n`);
  process.exitCode = 64;
});
