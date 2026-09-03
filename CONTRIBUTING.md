# Contributing

Thank you for helping improve TriageProof.

## Development

Requirements: Node.js 20 or newer.

```bash
npm test
npm run check
```

Changes to detection rules must include tests covering:

- a positive example assembled from clearly fake fragments;
- a nearby non-secret example to limit false positives;
- proof that Markdown and JSON reports do not contain the detected value;
- proof that sanitization replaces every occurrence consistently.

Never commit live credentials, private issue content, personal data, or a third party's report without permission.

## Scope

Before the first pilot cycle, changes should stay focused on the four reproducibility checks, safe reporting, and GitHub Action reliability. Larger configuration systems and AI integrations belong in a design issue first.
