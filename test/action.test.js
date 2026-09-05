import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ACTION = fileURLToPath(new URL("../src/action.js", import.meta.url));
const COMPLETE_BODY = `## Steps to reproduce
1. Run the command.

## Environment
Node.js 22 on Linux.

## Expected behavior
The command should pass.

## Actual behavior
The command fails every time.`;

async function runAction(event, mode = "advisory", rawEvent, replay = false) {
  const directory = await mkdtemp(join(tmpdir(), "triageproof-action-"));
  const eventPath = join(directory, "event.json");
  const summaryPath = join(directory, "summary.md");
  const outputPath = join(directory, "output.txt");

  await writeFile(eventPath, rawEvent ?? JSON.stringify(event), "utf8");
  await writeFile(summaryPath, "", "utf8");
  await writeFile(outputPath, "", "utf8");

  const processResult = spawnSync(process.execPath, [ACTION], {
    encoding: "utf8",
    cwd: directory,
    env: {
      ...process.env,
      GITHUB_EVENT_PATH: replay ? join(directory, "not-the-replayed-event.json") : eventPath,
      "INPUT_EVENT-PATH": replay ? eventPath : "",
      GITHUB_STEP_SUMMARY: summaryPath,
      GITHUB_OUTPUT: outputPath,
      INPUT_MODE: mode
    }
  });

  return {
    processResult,
    summary: await readFile(summaryPath, "utf8"),
    actionOutput: await readFile(outputPath, "utf8")
  };
}

test("action reads the event file as data and emits only a controlled report", async () => {
  const token = `ghp_${"Z9y8".repeat(8)}`;
  const githubExpression = "$" + "{{ secrets.ADMIN }}";
  const malicious = `::error::PWN ${githubExpression} $(touch canary) ${token}`;
  const body = COMPLETE_BODY.replace("1. Run the command.", `1. ${malicious}`);
  const { processResult, summary, actionOutput } = await runAction({ issue: { body } });
  const allOutput = processResult.stdout + processResult.stderr + summary + actionOutput;

  assert.equal(processResult.status, 0);
  assert.match(summary, /TriageProof report/);
  assert.match(summary, /GITHUB_TOKEN/);
  assert.match(actionOutput, /status=blocked/);
  assert.equal(allOutput.includes(token), false);
  assert.equal(allOutput.includes("::error::PWN"), false);
  assert.equal(allOutput.includes("secrets.ADMIN"), false);
});

test("action treats an empty issue body as an incomplete report", async () => {
  const { processResult, summary, actionOutput } = await runAction({ issue: { body: null } });

  assert.equal(processResult.status, 0);
  assert.match(summary, /Needs information/);
  assert.match(summary, /Completeness:\*\* 0\/100/);
  assert.match(actionOutput, /status=needs-info/);
  assert.match(actionOutput, /score=0/);
});

test("action reads a pull request body", async () => {
  const { processResult, actionOutput } = await runAction({ pull_request: { body: COMPLETE_BODY } });

  assert.equal(processResult.status, 0);
  assert.match(actionOutput, /status=ready/);
  assert.match(actionOutput, /score=100/);
});

test("explicit replay path takes precedence over the runner event path", async () => {
  const { processResult, actionOutput } = await runAction(
    { issue: { body: COMPLETE_BODY } }, "advisory", undefined, true
  );
  assert.equal(processResult.status, 0);
  assert.match(actionOutput, /status=ready/);
});

test("advisory mode always reports without failing", async (context) => {
  const token = `ghp_${"A1b2".repeat(8)}`;
  const cases = [
    ["ready", COMPLETE_BODY],
    ["needs-info", ""],
    ["blocked", `${COMPLETE_BODY}\ntoken=${token}`]
  ];

  for (const [status, body] of cases) {
    await context.test(status, async () => {
      const result = await runAction({ issue: { body } }, "advisory");
      assert.equal(result.processResult.status, 0);
      assert.match(result.actionOutput, new RegExp(`status=${status}`));
    });
  }
});

test("strict mode maps report status to an exit code", async (context) => {
  const token = `ghp_${"C3d4".repeat(8)}`;
  const cases = [
    ["ready", COMPLETE_BODY, 0],
    ["needs-info", "", 1],
    ["blocked", `${COMPLETE_BODY}\ntoken=${token}`, 2]
  ];

  for (const [status, body, exitCode] of cases) {
    await context.test(status, async () => {
      const result = await runAction({ issue: { body } }, "strict");
      assert.equal(result.processResult.status, exitCode);
      assert.match(result.actionOutput, new RegExp(`status=${status}`));
    });
  }
});

test("action rejects an unsupported mode", async () => {
  const { processResult, summary, actionOutput } = await runAction(
    { issue: { body: COMPLETE_BODY } },
    "silently-ignore-errors"
  );

  assert.equal(processResult.status, 64);
  assert.match(processResult.stderr, /Unsupported mode/);
  assert.equal(summary, "");
  assert.equal(actionOutput, "");
});

test("action rejects unsupported events without reflecting their content", async () => {
  const payload = "private-body-must-not-be-printed";
  const { processResult, summary, actionOutput } = await runAction({ comment: { body: payload } });
  const allOutput = processResult.stdout + processResult.stderr + summary + actionOutput;

  assert.equal(processResult.status, 64);
  assert.equal(allOutput.includes(payload), false);
});

test("action rejects an oversized event before parsing it", async () => {
  const oversized = "x".repeat(1024 * 1024 + 1);
  const { processResult, summary, actionOutput } = await runAction({}, "advisory", oversized);

  assert.equal(processResult.status, 64);
  assert.match(processResult.stderr, /event file exceeds the safety limit/);
  assert.equal(summary, "");
  assert.equal(actionOutput, "");
});

test("malformed JSON and event shapes fail without reflecting input", async (context) => {
  const token = `ghp_${"F5e6".repeat(8)}`;
  const cases = [
    ["broken JSON", `{"issue": {"body": "${token}"`],
    ["non-JSON credential", token],
    ["invalid UTF-8", Buffer.from([0xff, 0xfe, 0xfd])],
    ["null event", "null"],
    ["array event", "[]"],
    ["string event", JSON.stringify(token)],
    ["string subject", JSON.stringify({ issue: token })],
    ["array subject", JSON.stringify({ issue: [] })],
    ["missing body", JSON.stringify({ issue: {} })],
    ["object body", JSON.stringify({ issue: { body: { token } } })],
    ["NUL body", JSON.stringify({ issue: { body: `${token}\0` } })],
    ["oversized body", JSON.stringify({ issue: { body: token + "x".repeat(256 * 1024) } })]
  ];
  for (const [name, rawEvent] of cases) {
    await context.test(name, async () => {
      const { processResult, summary, actionOutput } = await runAction({}, "advisory", rawEvent);
      assert.equal(processResult.status, 64);
      assert.match(processResult.stderr, /^TriageProof action failed:/);
      assert.equal(processResult.stdout + summary + actionOutput, "");
      assert.equal(processResult.stderr.includes(token), false);
    });
  }
});
