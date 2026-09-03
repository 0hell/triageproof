import test from "node:test";
import assert from "node:assert/strict";
import { analyzeIssue, redactSecrets, renderMarkdown } from "../src/index.js";

const ENGLISH_REPORT = `# Bug report

## Steps to reproduce
1. Install the package.
2. Run \`tool inspect example.md\`.

## Environment
Node.js 22 on Windows 11.

## Expected behavior
The report should be generated successfully.

## Actual behavior
The command exits with status 1 and no report.
`;

const CHINESE_REPORT = `# 问题报告

## 复现步骤
1. 安装软件包。
2. 执行检查命令并打开示例文件。

## 环境信息
Windows 11，Node.js 22。

## 预期结果
命令正常生成检查报告。

## 实际结果
命令退出并且没有生成报告。
`;

test("accepts a complete English issue", () => {
  const result = analyzeIssue(ENGLISH_REPORT);
  assert.equal(result.status, "ready");
  assert.equal(result.score, 100);
  assert.deepEqual(result.missing, []);
});

test("accepts a complete Chinese issue", () => {
  const result = analyzeIssue(CHINESE_REPORT);
  assert.equal(result.status, "ready");
  assert.equal(result.score, 100);
});

test("identifies missing expected and actual results", () => {
  const result = analyzeIssue(`## Steps to reproduce\n1. Run the example command.\n\n## Environment\nNode 22`);
  assert.equal(result.status, "needs-info");
  assert.equal(result.score, 60);
  assert.deepEqual(result.missing, ["expected", "actual"]);
});

test("blocks high-confidence secrets without returning their values", () => {
  const secret = `sk-proj-${"A1b2".repeat(8)}`;
  const result = analyzeIssue(`${ENGLISH_REPORT}\nAPI key: ${secret}`);
  const serialized = JSON.stringify(result);
  const markdown = renderMarkdown(result);

  assert.equal(result.status, "blocked");
  assert.equal(result.security.potentialSecrets, 1);
  assert.equal(serialized.includes(secret), false);
  assert.equal(markdown.includes(secret), false);
  assert.match(markdown, /OPENAI_KEY/);
});

test("redacts repeated values with a stable placeholder", () => {
  const token = `ghp_${"a1B2".repeat(8)}`;
  const result = redactSecrets(`first=${token}\nsecond=${token}`);

  assert.equal(result.text.includes(token), false);
  assert.equal(result.findings.length, 2);
  assert.equal(result.findings[0].placeholder, "[GITHUB_TOKEN_1]");
  assert.equal(result.findings[1].placeholder, "[GITHUB_TOKEN_1]");
});

test("specific detectors win over overlapping generic assignments", () => {
  const token = `sk-${"z9Y8".repeat(8)}`;
  const result = analyzeIssue(`${ENGLISH_REPORT}\napi_key=${token}`);

  assert.equal(result.security.potentialSecrets, 1);
  assert.equal(result.security.findings[0].type, "OPENAI_KEY");
});
