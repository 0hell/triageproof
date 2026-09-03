import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ACTION = fileURLToPath(new URL("../src/action.js", import.meta.url));

test("action reads the event file as data and emits only a controlled report", async () => {
  const directory = await mkdtemp(join(tmpdir(), "triageproof-action-"));
  const eventPath = join(directory, "event.json");
  const summaryPath = join(directory, "summary.md");
  const outputPath = join(directory, "output.txt");
  const token = `ghp_${"Z9y8".repeat(8)}`;
  const githubExpression = "$" + "{{ secrets.ADMIN }}";
  const malicious = `::error::PWN ${githubExpression} $(touch canary) ${token}`;
  const body = `## Steps to reproduce\n1. ${malicious}\n\n## Environment\nNode 22 on Linux\n\n## Expected behavior\nThe command should pass.\n\n## Actual behavior\nThe command fails every time.`;

  await writeFile(eventPath, JSON.stringify({ action: "opened", issue: { body } }), "utf8");
  await writeFile(summaryPath, "", "utf8");
  await writeFile(outputPath, "", "utf8");

  const result = spawnSync(process.execPath, [ACTION], {
    encoding: "utf8",
    cwd: directory,
    env: {
      ...process.env,
      GITHUB_EVENT_PATH: eventPath,
      GITHUB_STEP_SUMMARY: summaryPath,
      GITHUB_OUTPUT: outputPath,
      INPUT_MODE: "advisory"
    }
  });

  const summary = await readFile(summaryPath, "utf8");
  const actionOutput = await readFile(outputPath, "utf8");
  const allOutput = result.stdout + result.stderr + summary + actionOutput;

  assert.equal(result.status, 0);
  assert.match(summary, /TriageProof report/);
  assert.match(summary, /GITHUB_TOKEN/);
  assert.match(actionOutput, /status=blocked/);
  assert.equal(allOutput.includes(token), false);
  assert.equal(allOutput.includes("::error::PWN"), false);
  assert.equal(allOutput.includes("secrets.ADMIN"), false);
});
