# Pilot program

TriageProof is looking for a small number of opt-in open-source repositories that receive public bug reports. The pilot evaluates whether the current four-field preflight is useful; it is not permission to collect or republish issue content.

## Five-minute installation

Create `.github/workflows/issue-preflight.yml` in the pilot repository:

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
      - uses: 0hell/triageproof@v0
        with:
          mode: advisory
```

Keep `advisory` during evaluation. It writes a report without failing the workflow. Pin a full commit SHA if the repository requires immutable third-party Actions.

Open or edit a public test issue containing no sensitive data, then read the result at **Actions → Issue preflight → Summary**. To uninstall, delete the workflow file; TriageProof stores no server-side state and requests no repository permissions.

## Pilot states

- `interested`: a maintainer replied, but no consent or run exists;
- `consented`: a maintainer with repository authority explicitly agreed;
- `installed`: a verifiable integration or local setup exists;
- `active`: at least one non-demo issue was processed;
- `retained`: the maintainer chose to keep or continue evaluating the tool.

Only `active` external repositories count as real-use evidence. Interest, stars, self-controlled repositories, and unit-test fixtures do not.

## Evaluation

1. Start with `advisory` mode.
2. Process one to five public issue bodies after manually removing any known sensitive data.
3. Record whether each missing-field warning was useful, neutral, or incorrect.
4. Do not publish or upload original issue text as part of the pilot.
5. Share only aggregate counts and feedback approved by the maintainer.

Use the [pilot feedback form](https://github.com/0hell/triageproof/issues/new?template=pilot-feedback.yml) for public-safe results. Use [pilot-register.example.csv](pilot-register.example.csv) as the private working template. The real `pilot-register.csv` is ignored by Git because it may contain consent notes that are not approved for publication.

## Evidence record

| Field | Value |
| --- | --- |
| Public repository URL | |
| Maintainer consent URL or note | |
| Pilot date | |
| TriageProof version/commit | |
| Number of public issues checked | |
| Useful warnings | |
| Neutral warnings | |
| Incorrect warnings | |
| Potential secrets found | |
| Maintainer-approved feedback | |
| Follow-up issue or pull request | |

Historical backtests and live issue runs must be counted separately.

## Guardrails

- Ask before testing or posting results about someone else's project.
- Follow each repository's contribution and promotion rules.
- Do not post repetitive promotional messages in project issues or discussions.
- Never claim a repository is an adopter without maintainer confirmation.
- Never include secret values, private issue data, personal data, or invented metrics.
- Record only the type and count of a suspected secret; never retain the matched value.
