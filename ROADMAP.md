# Roadmap

This roadmap separates current capabilities from planned work.

## v0.1 — public MVP

- [x] Read Markdown from a file or standard input
- [x] Check four reproducibility fields in English and Simplified Chinese
- [x] Detect and redact a small set of high-confidence credential patterns
- [x] Emit Markdown or JSON without echoing detected values
- [x] Ship offline tests and examples
- [x] Publish the public repository, CI, the `v0.1.x` releases, and the moving `v0` Action tag

## v0.2 — Pilot Ready

- [x] Read GitHub issue and pull request bodies from the event file
- [x] Write an advisory report to the workflow summary
- [x] Keep the default action read-only and non-mutating
- [x] Add equivalent English and Simplified Chinese five-minute onboarding
- [x] Handle empty bodies and invalid Action modes safely
- [x] Expand Action behavior and security regression tests
- [x] Add a public-safe, structured pilot feedback path
- [x] Run an offline end-to-end demo with saved reports
- [x] Harden malformed event failures without echoing input
- [x] Add a CI job that loads the real Action entry point with synthetic issue data

Version 0.2.0 is prepared for release. Release status and CI results are available on GitHub.
The original public issue-event check remains a follow-up below; the synthetic Action
test validates packaging and runner execution, not delivery of live Issue events.

Pilot adoption is measured after the release and does not block the tag. See [docs/V0.2_PLAN.md](docs/V0.2_PLAN.md) for scope and acceptance criteria.

## First live validation

- [ ] Record one public issue-event run in this repository
- [ ] Obtain consenting external pilots and maintainer-approved feedback

## After the first pilots

- Improve rules based on measured false positives and missing cases
- Add an explicitly untrusted, sanitized agent packet
- Evaluate optional gitleaks interoperability
- Prototype optional Codex-assisted follow-up questions using only sanitized content
- Add configuration only when pilot repositories demonstrate a shared need

Planned items are not current product claims.

## Application checkpoint

The team may prepare an application after the MVP is public and the maintainer role is verifiable, provided the evidence ledger contains roughly:

- three to five consenting external public-repository pilots;
- at least two pilots with a real (not demo-only) run;
- at least one maintainer who elects to retain or continue evaluating the tool;
- at least one maintainer-approved feedback reference;
- dated, reproducible counts that separate historical backtests from live use.

This is an internal readiness signal, not an OpenAI eligibility threshold or a promise of acceptance. Development of broader secret detection, agent packets, and optional Codex assistance can continue while the application is reviewed.
