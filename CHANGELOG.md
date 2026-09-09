# Changelog

All notable changes will be documented here.

## Unreleased

## 0.2.3 — 2026-09-09

- Recognize common GitHub issue-form headings (`To Reproduce`, `Your Environment (...)`, expected/actual behavior).
- Expand Simplified Chinese heading aliases and strip parenthetical helper text from headings.
- Keep same-field nested headings such as `### Minimal reproduction` under the enclosing required section.
- Ship a leaner npm package without demo screenshots and add a maintainer publish checklist.
- Clarify the Marketplace-facing Action description while keeping the Action read-only.

## 0.2.2 — 2026-09-08

- Recognize reproduction evidence under nested Markdown subheadings without counting unrelated sibling sections as evidence.
- Use Node.js 24-based checkout/setup actions pinned to full commit SHAs and test the CLI on Node.js 22 and 24.
- Disable persisted checkout credentials in CI.
- Include the existing live Issue walkthrough, source-labeled screenshots, and before/after fixtures in the release package.
- Document installation from the versioned Release archive without requiring an npm registry publication.

## 0.2.1 — 2026-09-05

- Run the GitHub Action on Node.js 24 and add a regression check for the runtime declaration.

## 0.2.0 — 2026-09-05

- Add `npm run demo`: an offline CLI, JSON, Markdown, redaction, and Action walkthrough with saved reports.
- Prevent malformed JSON, UTF-8, and event shapes from leaking input fragments through Action errors.
- Add regression coverage for invalid event payloads, oversized bodies, and safe failures.
- Add an optional trusted `event-path` Action input for local replay and CI smoke validation.
- Add a CI job that invokes the actual local Action and verifies its exported outputs using synthetic data.
- Read the CLI version from package.json and include demo scripts and documentation in the package.
- Keep live issue-event validation and external pilot results separate from synthetic self-tests.

## 0.1.1 — 2026-09-03

- Redesign the English and Simplified Chinese repository homepages around five-minute adoption.
- Add a structured, public-safe pilot feedback form and v0.2 release plan.
- Treat empty GitHub issue bodies as incomplete reports instead of Action failures.
- Reject unsupported Action modes and expand Action reliability and output-safety tests.

## 0.1.0 — 2026-09-03

- Add local issue completeness checks for English and Simplified Chinese reports.
- Add high-confidence credential preflight and stable redaction placeholders.
- Add Markdown and JSON output.
- Add an advisory, non-mutating GitHub Action entry point.
- Add pilot and application evidence templates.
