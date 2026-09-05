# TriageProof v0.2.0 — Pilot Ready

This release makes the existing issue preflight easier to evaluate locally and hardens
the GitHub Action's error handling.

## New in this release

- `npm run demo` runs the CLI, JSON and Markdown reports, sanitization, and both Action modes with synthetic examples. Reports are saved locally for inspection.
- Malformed JSON, invalid UTF-8, and invalid event shapes produce controlled errors without copying input fragments into logs.
- CI now loads the actual Action from the checkout and verifies status, score, and potential-secret outputs.
- An optional `event-path` Action input supports replay of a maintainer-controlled event JSON file. Ordinary issue workflows keep the default runner event.
- The CLI reads its version from package.json. The distributable includes demo scripts, examples, and documentation.

## Validation

- 44 passing test cases, including nested cases, in the local regression run.
- Offline demo passed for ready, needs-info, and blocked reports, plus sanitization.
- An independently extracted package passed the same demonstration.
- GitHub CI checks the release source and the actual Action entry point.

## Try it

```sh
git clone https://github.com/0hell/triageproof.git
cd triageproof
git checkout v0.2.0
npm run demo
```

For GitHub workflows, use `0hell/triageproof@v0.2.0`, the moving `@v0`, or a full
commit SHA according to your repository policy. Start with `mode: advisory`.

All demonstration inputs are synthetic. A live issue-event run and external pilot
feedback remain to be collected; this release does not claim real-world adoption.
There are no API calls, telemetry, or automatic issue mutations.

The source package attached here is for local use; this release is not an npm registry publication.
