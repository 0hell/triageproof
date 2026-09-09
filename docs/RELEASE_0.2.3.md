# TriageProof v0.2.3 — Template-ready headings and cleaner packaging

External pilots use repository issue templates, not the four headings in this
repository's examples. v0.2.3 recognizes the headings maintainers already ship and
keeps nested reproduction subsections intact.

## Changes

- Recognize common GitHub issue-form headings such as `To Reproduce`,
  `Your Environment (...)`, `Expected behavior`, and `Actual behavior`.
- Expand Simplified Chinese aliases including `复现`, `操作系统`, `期望`, and `实际表现`.
- Strip parenthetical notes from headings so template helper text does not hide a field.
- Keep a deeper heading that names the current field (for example
  `### Minimal reproduction` under `## Steps to reproduce`) as a nested subsection.
- Ship a leaner npm package: source, CLI, examples, and Markdown docs only.
- Improve Marketplace description text and add the maintainer publish checklist
  ([docs/PUBLISH.md](PUBLISH.md)).

## Install or update

GitHub Action:

```yaml
- uses: 0hell/triageproof@v0.2.3
  with:
    mode: advisory
```

Workflows using `0hell/triageproof@v0` receive this patch once the compatibility tag
is advanced. Pin a full commit SHA where your supply-chain policy requires immutable actions.

CLI (Node.js 22 or 24 recommended):

```bash
npm install -g https://github.com/0hell/triageproof/releases/download/v0.2.3/triageproof-0.2.3.tgz
triageproof check issue.md
```

The package remains unpublished on the public npm registry until the maintainer token
is configured. The GitHub Release archive is the supported install path today.

## Verification and scope

51 automated tests cover nested sibling headings, common English and Chinese template
forms, placeholders, fenced code, hidden comments, CLI behavior, safe reporting, and
Action advisory/strict modes. Offline demo and hosted CI checks remain the release gate.

This release makes no API calls, collects no telemetry, and performs no automatic
Issue mutations. External pilot evidence is still tracked separately and is not
claimed here.
