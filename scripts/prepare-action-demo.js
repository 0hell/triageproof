import { mkdir, readFile, writeFile } from "node:fs/promises";

const output = new URL("../demo-output/", import.meta.url);
await mkdir(output, { recursive: true });
const body = await readFile(new URL("../examples/incomplete-issue.md", import.meta.url), "utf8");
await writeFile(new URL("action-event.json", output), JSON.stringify({
  action: "opened",
  issue: { body }
}, null, 2));
console.log("Prepared a synthetic issue event. This is a self-test, not external adoption.");
