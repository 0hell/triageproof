# Roadmap

This roadmap separates current capabilities from planned work.

## v0.1 — local preflight

- [x] Read Markdown from a file or standard input
- [x] Check four reproducibility fields in English and Simplified Chinese
- [x] Detect and redact a small set of high-confidence credential patterns
- [x] Emit Markdown or JSON without echoing detected values
- [x] Ship offline tests and examples

## v0.2 — adoption path

- [x] Read GitHub issue and pull request bodies from the event file
- [x] Write an advisory report to the workflow summary
- [x] Keep the default action read-only and non-mutating
- [ ] Validate the action in a public repository
- [ ] Publish the first tagged release
- [ ] Document three opt-in pilot results

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
