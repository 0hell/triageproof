# TriageProof

Evidence-first issue preflight for open-source maintainers.

TriageProof checks whether a bug report includes reproduction steps, environment details, expected behavior, and actual behavior. It also detects a deliberately small set of high-confidence secret patterns before the report is posted or handed to an automated workflow.

The core is local, deterministic, zero-dependency, and does not send issue content anywhere.

> Status: early MVP. TriageProof is a preflight aid, not a guarantee that a report is complete or free of sensitive data.

## Try it

Requires Node.js 20 or newer.

```bash
node bin/triageproof.js check examples/complete-issue.md
```

Read a report from standard input:

```bash
node bin/triageproof.js check - < issue.md
```

Produce JSON for another tool:

```bash
node bin/triageproof.js check issue.md --format json
```

Redact detected values before sharing:

```bash
node bin/triageproof.js sanitize issue.md
```

## What v0.1 checks

- Reproduction steps
- Environment information
- Expected behavior
- Actual behavior
- A small, high-confidence set of credential patterns
- English and Simplified Chinese section headings

Check exit codes are `0` for ready, `1` for missing information, `2` for a potential secret, and `64` for invalid input.

## GitHub Action

The bundled action reads the issue or pull request body from GitHub's event file. It makes no API or network request, does not execute report content, and writes a report to the job summary.

```yaml
name: Issue preflight
on:
  issues:
    types: [opened, edited]

permissions: {}

jobs:
  preflight:
    runs-on: ubuntu-latest
    steps:
      - uses: 0hell/triageproof@v0
        with:
          mode: advisory
```

Pinning a full commit SHA is recommended for production use.

## Security boundary

TriageProof treats issue text as untrusted data. It never runs commands found in a report and the current action does not comment, close, label, or modify issues. Detection is intentionally incomplete and false positives are possible. See [SECURITY.md](SECURITY.md).

## Roadmap

The immediate goal is to validate the core with a small number of opt-in open-source pilots. Agent-oriented packets, broader detection, and optional Codex-assisted triage are planned work, not current capabilities. See [ROADMAP.md](ROADMAP.md).

## Contributing

Bug reports, test fixtures, translations, and pilot feedback are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
