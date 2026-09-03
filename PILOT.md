# Pilot program

TriageProof is looking for a small number of opt-in open-source repositories that receive public bug reports.

Pilot states are deliberately strict:

- `interested`: a maintainer replied, but no consent or run exists;
- `consented`: a maintainer with repository authority explicitly agreed;
- `installed`: a verifiable integration or local setup exists;
- `active`: at least one non-demo issue was processed;
- `retained`: the maintainer chose to keep or continue evaluating the tool.

Only `active` external repositories count as real-use evidence. Interest, stars, self-controlled repositories, and unit-test fixtures do not.

## Five-minute pilot

1. Run TriageProof against one to five existing, public issue bodies after manually removing any known sensitive data.
2. Record whether each missing-field warning was useful, neutral, or incorrect.
3. Do not publish or upload the original issue text as part of the pilot.
4. Share only aggregate counts and feedback that the maintainer has approved for publication.

## Evidence record

For each consenting repository, record:

| Field | Value |
| --- | --- |
| Public repository URL | |
| Maintainer consent URL or note | |
| Pilot date | |
| TriageProof version/commit | |
| Number of public issues checked | |
| Useful warnings | |
| False positives | |
| Potential secrets found | |
| Maintainer-approved feedback | |
| Follow-up issue or pull request | |

Use [pilot-register.example.csv](pilot-register.example.csv) as the private working template. The real `pilot-register.csv` is ignored by Git because it may contain consent notes that are not approved for publication. Historical backtests and live issue runs must be counted separately.

## Guardrails

- Ask before testing or posting results about someone else's project.
- Follow each repository's contribution and promotion rules.
- Do not post repetitive promotional messages in project issues or discussions.
- Never claim a repository is an adopter without maintainer confirmation.
- Never include secret values, private issue data, or invented metrics.
- Record only the type and count of a suspected secret; never retain the matched value.
