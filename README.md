<p align="center">
  <img src="docs/assets/hero.svg" width="900" alt="TriageProof — evidence-first issue preflight for open-source maintainers">
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://github.com/0hell/triageproof/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/0hell/triageproof/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/0hell/triageproof/tags"><img alt="Version" src="https://img.shields.io/github/v/tag/0hell/triageproof?sort=semver&amp;label=version"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://nodejs.org/"><img alt="Node.js 20+" src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&amp;logoColor=white"></a>
</p>

TriageProof checks public bug reports **before triage**. It flags missing reproduction evidence and a deliberately small set of high-confidence credential patterns, without sending issue content to an external service.

- **Useful reports:** check reproduction steps, environment, expected behavior, and actual behavior.
- **Local by default:** deterministic checks, zero runtime dependencies, no API calls, no telemetry.
- **Safe automation:** the GitHub Action is read-only and never comments, labels, closes, or edits an issue.

> **Early MVP:** TriageProof reduces avoidable triage work and accidental exposure. It does not guarantee that a report is complete or secret-free.

## See the result

```text
TriageProof report

Status: Needs information / 需要补充信息
Completeness: 25/100

Reproduction / 复现步骤   MISSING
Environment / 环境信息   PASS
Expected / 预期结果      MISSING
Actual / 实际结果        MISSING

Security preflight: no high-confidence pattern detected
```

Reports contain controlled findings and locations—not the original issue body or detected credential value.

## Add it to a repository in five minutes

Create `.github/workflows/issue-preflight.yml` in your repository:

```yaml
name: Issue preflight

on:
  issues:
    types: [opened, edited, reopened]

permissions: {}

jobs:
  preflight:
    runs-on: ubuntu-latest
    steps:
      - name: Check issue
        uses: 0hell/triageproof@v0
        with:
          mode: advisory
```

Commit the file, then open or edit an issue. Read the report at **Actions → Issue preflight → Summary**.

`advisory` is the recommended pilot mode: it always reports without blocking the workflow. Change it to `strict` to return exit code `1` for missing information or `2` for a potential secret. Pin a full commit SHA instead of `v0` where your supply-chain policy requires immutable actions.

## Run it locally

Requires Node.js 20 or newer. There are no runtime dependencies to install.

```bash
git clone https://github.com/0hell/triageproof.git
cd triageproof
node bin/triageproof.js check examples/complete-issue.md
```

Use your own Markdown file, standard input, JSON output, or sanitized output:

```bash
node bin/triageproof.js check issue.md
node bin/triageproof.js check - < issue.md
node bin/triageproof.js check issue.md --format json
node bin/triageproof.js sanitize issue.md > safe-issue.md
```

| Exit code | Meaning |
| ---: | --- |
| `0` | Ready for triage |
| `1` | More information is needed |
| `2` | A potential secret was detected |
| `64` | Invalid command, input, event, or Action mode |

## What v0.1 checks

| Check | Current behavior |
| --- | --- |
| Reproduction evidence | English and Simplified Chinese Markdown headings |
| Environment | Requires non-placeholder content |
| Expected and actual behavior | Checked separately for actionable gaps |
| Credential preflight | Small, high-confidence rules for selected keys, tokens, assignments, and private-key blocks |
| Safe reporting | Markdown or JSON without echoing detected values |

## Safety by design

- Issue and pull-request text is treated as untrusted data and is never executed.
- The core makes no network request and uploads no report content.
- The Action requests no repository permissions and performs no write operation.
- Input, event, and finding counts are bounded to prevent uncontrolled output.
- Secret detection is intentionally incomplete; use a dedicated repository scanner for broader coverage.

Read the exact threat boundary and reporting process in [SECURITY.md](SECURITY.md).

## Join the pilot

We are looking for a small number of opt-in open-source repositories that receive public bug reports. A pilot takes about five minutes to install and records only maintainer-approved aggregate feedback—never private issue text or secret values.

[Join or share pilot feedback](https://github.com/0hell/triageproof/issues/new?template=pilot-feedback.yml) · [Read the pilot guide](PILOT.md)

## Status and roadmap

`v0.1.1` is the public MVP. The next feature release is **v0.2 — Pilot Ready**, focused on Action reliability, onboarding, observable results, and a clean feedback loop. AI integrations, automatic issue mutation, broad secret scanning, and configuration systems are explicitly out of scope for v0.2.

See the [v0.2 plan](docs/V0.2_PLAN.md), [roadmap](ROADMAP.md), and [changelog](CHANGELOG.md).

## Contributing

Bug reports, safe test fixtures, translations, and pilot feedback are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

Released under the [MIT License](LICENSE).
