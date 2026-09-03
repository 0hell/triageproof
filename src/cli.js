import { readFile } from "node:fs/promises";
import { analyzeIssue } from "./analyzer.js";
import { redactSecrets } from "./redactor.js";
import { renderMarkdown } from "./report.js";
import { decodeInputBuffer, MAX_INPUT_BYTES } from "./limits.js";

const HELP = `TriageProof 0.1.1

Evidence-first issue preflight for open-source maintainers.

Usage:
  triageproof check <file|-> [--format markdown|json]
  triageproof sanitize <file|->
  triageproof --help
  triageproof --version

Exit codes for check:
  0  ready
  1  needs more information
  2  potential secret detected
  64 invalid command or input
`;

async function readStdin() {
  const chunks = [];
  let length = 0;
  for await (const chunk of process.stdin) {
    const buffer = Buffer.from(chunk);
    length += buffer.length;
    if (length > MAX_INPUT_BYTES) {
      throw new Error(`Input exceeds the ${MAX_INPUT_BYTES}-byte safety limit.`);
    }
    chunks.push(buffer);
  }
  return decodeInputBuffer(Buffer.concat(chunks));
}

async function readSource(path) {
  if (path === "-") return readStdin();
  return decodeInputBuffer(await readFile(path));
}

function argumentValue(args, flag, fallback) {
  const index = args.indexOf(flag);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

export async function main(args, output = console) {
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    output.log(HELP);
    return 0;
  }

  if (args.includes("--version") || args.includes("-v")) {
    output.log("0.1.1");
    return 0;
  }

  const [command, path] = args;
  if (!path || !["check", "sanitize"].includes(command)) {
    output.error("Invalid command. Run triageproof --help for usage.");
    return 64;
  }

  let input;
  try {
    input = await readSource(path);
  } catch (error) {
    output.error(`Could not process input: ${error.message}`);
    return 64;
  }

  if (command === "sanitize") {
    const redacted = redactSecrets(input);
    output.log(redacted.text);
    output.error(`TriageProof redacted ${redacted.findings.length} potential secret(s).`);
    return 0;
  }

  const format = argumentValue(args, "--format", "markdown");
  if (!new Set(["markdown", "json"]).has(format)) {
    output.error("Unsupported format. Use markdown or json.");
    return 64;
  }

  const result = analyzeIssue(input);
  output.log(format === "json" ? JSON.stringify(result, null, 2) : renderMarkdown(result));

  if (result.status === "blocked") return 2;
  if (result.status === "needs-info") return 1;
  return 0;
}
