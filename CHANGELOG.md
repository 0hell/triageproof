# Changelog

All notable changes will be documented here.

## Unreleased

## 0.2.0 — 2026-09-05

- Add `npm run demo`: an offline CLI, JSON, Markdown, redaction, and Action walkthrough with saved reports.
- Prevent malformed JSON, UTF-8, and event shapes from leaking input fragments through Action errors.
- Add regression coverage for invalid event payloads, oversized bodies, and safe failures.
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
