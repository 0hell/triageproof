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

## A real Issue → Action → ready walkthrough

[Demo issue #1](https://github.com/0hell/triageproof/issues/1) was opened and then
edited on **2026-09-05**, triggering two real GitHub Actions runs. The issue content
is a maintainer-created synthetic example.

### 1. Start with an incomplete issue

The [original body](examples/live-demo/before.md) deliberately includes only environment information:

```markdown
# Demonstration report

This is a maintainer-created synthetic example for the README, not a product defect.
The first version intentionally omits reproduction steps and expected/actual behavior.

## Environment

Windows 11, Node.js 22.12.0 (example environment).
```

### 2. Read the missing-information report

[Open the first Action run](https://github.com/0hell/triageproof/actions/runs/33952775281),
then scroll down in **Summary** to **TriageProof report** (sign in to GitHub if needed).
The saved body produces:

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

<!-- LIVE-DEMO-BEFORE-SCREENSHOT
After capturing the actual GitHub Summary, add the PNG and uncomment this image:
![Incomplete issue: needs information, 25/100](docs/assets/issue-preflight-needs-info.png)
-->

### 3. Complete the same issue and run it again

We edited the same issue to add reproduction steps, expected behavior, and actual
behavior. See the [complete body](examples/live-demo/after.md) and
[second Action run](https://github.com/0hell/triageproof/actions/runs/33952930498).

| Check | Before | After |
| --- | --- | --- |
| Reproduction | MISSING | PASS |
| Environment | PASS | PASS |
| Expected behavior | MISSING | PASS |
| Actual behavior | MISSING | PASS |
| Completeness | **25/100** | **100/100** |
| Report status | `needs-info` | **`ready`** |
| Potential secrets | 0 | 0 |

Both hosted runs completed successfully in `advisory` mode. **A green workflow
means the Action ran; the report status tells you whether the issue is ready.**
The results above were also verified by replaying the saved bodies through the
same Action version. This is a live integration demonstration, not external adoption evidence.

<!-- LIVE-DEMO-AFTER-SCREENSHOT
After capturing the actual GitHub Summary, add the PNG and uncomment this image:
![Completed issue: ready, 100/100](docs/assets/issue-preflight-ready.png)
-->

Report screenshots are pending. The [capture and replay guide](docs/LIVE_DEMO.md)
links to both reports and explains how to add the images here.

## Copy the workflow into your repository

Use the copy button on this code block and save it as
`.github/workflows/issue-preflight.yml` in your repository.
The same file is available at [examples/issue-preflight.yml](examples/issue-preflight.yml).

```yaml
name: Issue preflight

on:
  issues:
    types: [opened, edited, reopened]

permissions: {}

concurrency:
  group: triageproof-issue-${{ github.event.issue.number }}
  cancel-in-progress: true

jobs:
  preflight:
    runs-on: ubuntu-latest
    steps:
      - name: Check issue
        uses: 0hell/triageproof@v0
        with:
          mode: advisory
```

Commit the file to your **default branch**, then open or edit an issue. Read the
report at **Actions → Issue preflight → Summary → TriageProof report**.

`advisory` is the recommended pilot mode: it always reports without blocking the workflow. Change it to `strict` to return exit code `1` for missing information or `2` for a potential secret. Pin a full commit SHA instead of `v0` where your supply-chain policy requires immutable actions.

## Run it locally

Requires Node.js 20 or newer. There are no runtime dependencies to install.

```bash
git clone https://github.com/0hell/triageproof.git
cd triageproof
node bin/triageproof.js check examples/complete-issue.md
```

For a complete offline walkthrough, run `npm run demo`. It exercises the CLI, redaction,
and both Action modes using synthetic fixtures, then saves readable reports in a new
`demo-output/run-*/` directory. Start with `SUMMARY.md`. See the [local demo guide](docs/LOCAL_DEMO.md).

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

## What it checks

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

**v0.2 — Pilot Ready** adds a reproducible local demonstration, safe errors for malformed
events, and CI that loads the actual Action entry point. The version comes from one
package manifest. AI integrations, automatic issue mutation, broad secret scanning,
and configuration systems remain out of scope.

CI uses synthetic issue payloads. [Issue #1](https://github.com/0hell/triageproof/issues/1)
also exercises real `opened` and `edited` events with synthetic content; see the
[live demonstration record](docs/LIVE_DEMO.md). These checks do not establish
external adoption; maintainer feedback is tracked separately.

See the [v0.2 plan](docs/V0.2_PLAN.md), [roadmap](ROADMAP.md), and [changelog](CHANGELOG.md).

## Contributing

Bug reports, safe test fixtures, translations, and pilot feedback are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

Released under the [MIT License](LICENSE).
