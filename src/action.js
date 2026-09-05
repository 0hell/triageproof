import { appendFile, readFile } from "node:fs/promises";
import { analyzeIssue } from "./analyzer.js";
import { renderMarkdown } from "./report.js";
import { InputValidationError } from "./limits.js";

const MAX_EVENT_BYTES = 1024 * 1024;
class ActionError extends Error {}

function parseEvent(bytes) {
  let event;
  try {
    event = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new ActionError("GitHub event file must contain valid UTF-8 JSON");
  }
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    throw new ActionError("GitHub event must be an object");
  }
  const subject = event.issue ?? event.pull_request;
  if (!subject || typeof subject !== "object" || Array.isArray(subject) ||
      !Object.hasOwn(subject, "body")) {
    throw new ActionError("The event does not contain an issue or pull request body");
  }
  if (subject.body !== null && typeof subject.body !== "string") {
    throw new ActionError("The issue or pull request body is not text");
  }
  return subject.body ?? "";
}

async function appendKeyValue(path, key, value) {
  if (!path) return;
  await appendFile(path, `${key}=${String(value).replace(/\r?\n/g, " ")}\n`, "utf8");
}

async function run() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new ActionError("GITHUB_EVENT_PATH is not set");

  const mode = (process.env.INPUT_MODE ?? "advisory").trim().toLowerCase();
  if (!new Set(["advisory", "strict"]).has(mode)) {
    throw new ActionError('Unsupported mode. Use "advisory" or "strict".');
  }

  const eventBytes = await readFile(eventPath);
  if (eventBytes.length > MAX_EVENT_BYTES) throw new ActionError("GitHub event file exceeds the safety limit");
  const body = parseEvent(eventBytes);

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

  if (mode === "strict") {
    if (result.status === "blocked") process.exitCode = 2;
    else if (result.status === "needs-info") process.exitCode = 1;
  }
}

run().catch((error) => {
  const message = error instanceof ActionError || error instanceof InputValidationError
    ? error.message
    : "Could not read the event or write the Action report";
  process.stderr.write(`TriageProof action failed: ${message}\n`);
  process.exitCode = 64;
});
