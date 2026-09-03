import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeIssue,
  MAX_INPUT_BYTES,
  parseIssueSections,
  redactSecrets,
  renderMarkdown
} from "../src/index.js";

const REQUIRED_SECTIONS = `
## Environment
Node.js 22 on Linux.

## Expected behavior
The command should print a report.

## Actual behavior
The command exits without a report.
`;

test("headings inside fenced code do not satisfy a required field", () => {
  const input = `\`\`\`markdown
## Steps to reproduce
1. This is only an example inside a fence.
\`\`\`
${REQUIRED_SECTIONS}`;

  const result = analyzeIssue(input);
  assert.equal(result.status, "needs-info");
  assert.deepEqual(result.missing, ["reproduction"]);
});

test("headings and placeholders inside HTML comments do not satisfy fields", () => {
  const input = `<!--
## Steps to reproduce
Template guidance only.
-->
## 复现步骤
待补充
${REQUIRED_SECTIONS}`;

  const result = analyzeIssue(input);
  assert.equal(result.status, "needs-info");
  assert.deepEqual(result.missing, ["reproduction"]);
});

test("BOM and CRLF input remains parseable", () => {
  const input = `\uFEFF## 复现步骤\r\n1. 执行一个可以稳定复现问题的命令。\r\n${REQUIRED_SECTIONS.replace(/\n/g, "\r\n")}`;
  const sections = parseIssueSections(input);
  assert.match(sections.reproduction.text, /稳定复现/);
});

test("private keys are replaced and never appear in safe reports", () => {
  const privateKey = [
    "-----BEGIN PRIVATE KEY-----",
    "not-a-live-key-material-for-tests-only-1234567890",
    "-----END PRIVATE KEY-----"
  ].join("\n");
  const input = `## Steps to reproduce\n1. Run the example command.\n${REQUIRED_SECTIONS}\n${privateKey}`;
  const analyzed = analyzeIssue(input);
  const sanitized = redactSecrets(input);
  const outputs = JSON.stringify(analyzed) + renderMarkdown(analyzed) + sanitized.text;

  assert.equal(analyzed.status, "blocked");
  assert.equal(outputs.includes(privateKey), false);
  assert.match(sanitized.text, /\[PRIVATE_KEY_1\]/);
});

test("ordinary hashes and UUIDs do not trigger a high-confidence finding", () => {
  const input = `## Steps to reproduce\n1. Checkout commit 0123456789abcdef0123456789abcdef01234567.\n${REQUIRED_SECTIONS}\nBuild id: 123e4567-e89b-12d3-a456-426614174000`;
  assert.equal(analyzeIssue(input).security.potentialSecrets, 0);
});

test("untrusted workflow syntax is not reflected into Markdown output", () => {
  const payload = "::error::PWN ${{ secrets.ADMIN }} $(touch canary)";
  const input = `## Steps to reproduce\n1. ${payload}\n${REQUIRED_SECTIONS}`;
  const output = renderMarkdown(analyzeIssue(input));
  assert.equal(output.includes(payload), false);
  assert.equal(output.includes("::error::PWN"), false);
});

test("input beyond the safety limit fails instead of returning clean", () => {
  assert.throws(
    () => analyzeIssue("x".repeat(MAX_INPUT_BYTES + 1)),
    /safety limit/
  );
});
