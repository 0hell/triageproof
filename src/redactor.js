import { MAX_FINDINGS, validateInputText } from "./limits.js";

const PLACEHOLDER_VALUES = new Set([
  "example",
  "sample",
  "placeholder",
  "changeme",
  "change-me",
  "your-token",
  "your_token",
  "your-secret",
  "your_secret",
  "your-api-key",
  "your_api_key",
  "redacted"
]);

const DETECTORS = [
  {
    type: "PRIVATE_KEY",
    priority: 100,
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[^]*?-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g
  },
  {
    type: "OPENAI_KEY",
    priority: 90,
    pattern: /\bsk-(?:proj-|org-)?[A-Za-z0-9_-]{20,}\b/g
  },
  {
    type: "GITHUB_TOKEN",
    priority: 90,
    pattern: /\bgh[pousr]_[A-Za-z0-9]{20,255}\b/g
  },
  {
    type: "BEARER_TOKEN",
    priority: 70,
    pattern: /\bBearer\s+(?<value>[A-Za-z0-9._~+/=-]{20,})\b/gi
  },
  {
    type: "GENERIC_SECRET",
    priority: 50,
    pattern: /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|token|secret|password|passwd)\b\s*[:=]\s*["']?(?<value>[A-Za-z0-9._~+/=-]{12,})["']?/gi
  }
];

function positionAt(input, offset) {
  const before = input.slice(0, offset);
  const lines = before.split("\n");
  return { line: lines.length, column: lines.at(-1).length + 1 };
}

function candidateFromMatch(input, detector, match) {
  const value = match.groups?.value ?? match[0];
  const relativeOffset = match.groups?.value ? match[0].lastIndexOf(value) : 0;
  const start = match.index + relativeOffset;
  const end = start + value.length;
  const position = positionAt(input, start);
  return {
    type: detector.type,
    priority: detector.priority,
    start,
    end,
    length: value.length,
    line: position.line,
    column: position.column,
    value
  };
}

function overlaps(left, right) {
  return left.start < right.end && right.start < left.end;
}

function collectCandidates(input) {
  const candidates = [];

  for (const detector of DETECTORS) {
    const pattern = new RegExp(detector.pattern.source, detector.pattern.flags);
    for (const match of input.matchAll(pattern)) {
      const candidate = candidateFromMatch(input, detector, match);
      if (!PLACEHOLDER_VALUES.has(candidate.value.toLowerCase())) candidates.push(candidate);
    }
  }

  candidates.sort((left, right) =>
    right.priority - left.priority ||
    right.length - left.length ||
    left.start - right.start
  );

  const accepted = [];
  for (const candidate of candidates) {
    if (!accepted.some((existing) => overlaps(existing, candidate))) accepted.push(candidate);
  }

  return accepted.sort((left, right) => left.start - right.start);
}

export function findSecrets(input) {
  return inspectSecrets(input).findings;
}

export function redactSecrets(input) {
  const source = validateInputText(input);
  const candidates = collectCandidates(source);
  const counters = new Map();
  const placeholders = new Map();

  for (const candidate of candidates) {
    const identity = `${candidate.type}\u0000${candidate.value}`;
    if (!placeholders.has(identity)) {
      const number = (counters.get(candidate.type) ?? 0) + 1;
      counters.set(candidate.type, number);
      placeholders.set(identity, `[${candidate.type}_${number}]`);
    }
    candidate.placeholder = placeholders.get(identity);
  }

  let text = source;
  for (const candidate of [...candidates].sort((left, right) => right.start - left.start)) {
    text = text.slice(0, candidate.start) + candidate.placeholder + text.slice(candidate.end);
  }

  return {
    text,
    findings: candidates.slice(0, MAX_FINDINGS).map(({ value: _value, priority: _priority, start: _start, end: _end, placeholder, ...safe }) => ({
      ...safe,
      placeholder
    })),
    findingCount: candidates.length,
    findingsTruncated: candidates.length > MAX_FINDINGS
  };
}

export function inspectSecrets(input) {
  const source = validateInputText(input);
  const candidates = collectCandidates(source);
  return {
    findings: candidates.slice(0, MAX_FINDINGS).map(({ value: _value, priority: _priority, start: _start, end: _end, ...safe }) => safe),
    findingCount: candidates.length,
    findingsTruncated: candidates.length > MAX_FINDINGS
  };
}

export { DETECTORS };
