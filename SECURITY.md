# Security policy

## Supported versions

Only the latest tagged release is supported during the pre-1.0 period.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature when the public repository is available. Do not include live credentials in a report. If private reporting is unavailable, open a public issue containing only a non-sensitive description and ask the maintainer to establish a private channel.

## Security boundary

TriageProof is a heuristic preflight tool. It does not guarantee detection of every secret, credential, personal identifier, or unsafe instruction.

The GitHub Action:

- reads an event JSON file as data;
- does not execute commands from issue or pull request text;
- makes no network or GitHub API request;
- does not request write permissions;
- does not automatically comment, label, close, or edit issues.

Users should still review content before publishing it and should use dedicated secret-scanning tools for broader repository coverage.

TriageProof v0.1 does not bundle, invoke, or claim compatibility with Gitleaks. Its small built-in rules avoid a required external binary and keep untrusted issue text out of shell commands. Optional interoperability with a pinned scanner and trusted configuration may be evaluated after the first pilots.
