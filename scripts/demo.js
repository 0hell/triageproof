import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { mkdir } from "node:fs/promises";
import { VERSION } from "../src/version.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const cli = join(root, "bin", "triageproof.js");
const action = join(root, "src", "action.js");
const outputRoot = join(root, "demo-output");
await mkdir(outputRoot, { recursive: true });
const output = await mkdtemp(join(outputRoot, "run-"));
const complete = await readFile(join(root, "examples", "complete-issue.md"), "utf8");
const incomplete = await readFile(join(root, "examples", "incomplete-issue.md"), "utf8");
const fakeToken = `ghp_${"Demo0nly".repeat(4)}`;
const cases = [
  { name: "ready", body: complete, score: 100, code: 0 },
  { name: "needs-info", body: incomplete, score: 25, code: 1 },
  { name: "blocked", body: `${complete}\nToken: ${fakeToken}\n`, score: 100, code: 2 }
];
const summary = [
  `# TriageProof ${VERSION} local demonstration`,
  "",
  "Synthetic examples only. This run is not evidence of external adoption.",
  "",
  "| Case | CLI exit | Score | Advisory exit | Strict exit |",
  "| --- | ---: | ---: | ---: | ---: |"
];

function run(file, args = [], options = {}) {
  const result = spawnSync(process.execPath, [file, ...args], {
    encoding: "utf8", timeout: 15000, cwd: output, ...options
  });
  assert.equal(result.error, undefined, "Demo child process must complete");
  assert.notEqual(result.status, null, "Demo child process must return an exit code");
  assert.equal((result.stdout + result.stderr).includes(fakeToken), false,
    "Detected credential must not appear in process output");
  return result;
}

for (const item of cases) {
  const json = run(cli, ["check", "-", "--format", "json"], { input: item.body });
  assert.equal(json.status, item.code);
  const parsed = JSON.parse(json.stdout);
  assert.equal(parsed.status, item.name);
  assert.equal(parsed.score, item.score);
  await writeFile(join(output, `${item.name}.json`), json.stdout);

  const markdown = run(cli, ["check", "-"], { input: item.body });
  assert.equal(markdown.status, item.code);
  await writeFile(join(output, `${item.name}.md`), markdown.stdout);

  const eventFile = join(output, "synthetic-event.json");
  await writeFile(eventFile, JSON.stringify({ action: "opened", issue: { body: item.body } }));
  for (const mode of ["advisory", "strict"]) {
    const reportFile = join(output, `${item.name}-${mode}-action.md`);
    const outputsFile = join(output, `${item.name}-${mode}-outputs.txt`);
    const result = run(action, [], { env: {
      ...process.env,
      "INPUT_EVENT-PATH": "", GITHUB_EVENT_PATH: eventFile, GITHUB_STEP_SUMMARY: reportFile,
      GITHUB_OUTPUT: outputsFile, INPUT_MODE: mode
    } });
    assert.equal(result.status, mode === "strict" ? item.code : 0);
    const report = await readFile(reportFile, "utf8");
    const outputs = await readFile(outputsFile, "utf8");
    assert.match(report, /TriageProof report/);
    assert.ok(outputs.includes(`status=${item.name}\n`));
    assert.ok(outputs.includes(`score=${item.score}\n`));
    assert.equal((report + outputs).includes(fakeToken), false);
  }
  summary.push(`| ${item.name} | ${item.code} | ${item.score} | 0 | ${item.code} |`);
  console.log(`PASS ${item.name}: CLI, Markdown, JSON, advisory and strict Action`);
}

const sanitized = run(cli, ["sanitize", "-"], { input: cases[2].body });
assert.equal(sanitized.status, 0);
assert.match(sanitized.stdout, /\[GITHUB_TOKEN_1\]/);
await writeFile(join(output, "sanitized-issue.md"), sanitized.stdout);
// Retain only a harmless fixture, even though the credential above is synthetic.
await writeFile(join(output, "synthetic-event.json"), JSON.stringify({ issue: { body: complete } }, null, 2));
summary.push("", "Sanitization: PASS. The synthetic token was replaced by [GITHUB_TOKEN_1].", "");
await writeFile(join(output, "SUMMARY.md"), summary.join("\n"));
console.log(`PASS sanitize: stable placeholder, no detected value in outputs`);
console.log(`Reports: ${output}`);
