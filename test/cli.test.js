import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("../bin/triageproof.js", import.meta.url));

test("CLI emits Markdown and returns needs-info exit code", async () => {
  const directory = await mkdtemp(join(tmpdir(), "triageproof-"));
  const issue = join(directory, "issue.md");
  await writeFile(issue, "## Environment\nNode.js 22\n", "utf8");

  const result = spawnSync(process.execPath, [CLI, "check", issue], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /TriageProof report/);
  assert.match(result.stdout, /Needs information/);
});

test("sanitize never writes a detected value to stdout or stderr", async () => {
  const directory = await mkdtemp(join(tmpdir(), "triageproof-"));
  const issue = join(directory, "issue.md");
  const token = `ghp_${"Ab12".repeat(8)}`;
  await writeFile(issue, `token=${token}\n`, "utf8");

  const result = spawnSync(process.execPath, [CLI, "sanitize", issue], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.equal(`${result.stdout}${result.stderr}`.includes(token), false);
  assert.match(result.stdout, /\[GITHUB_TOKEN_1\]/);
});
