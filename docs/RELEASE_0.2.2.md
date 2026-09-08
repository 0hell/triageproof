# TriageProof v0.2.2 — Reliable issue sections

Bug reports often put a `### Minimal reproduction` subsection below `## Steps to reproduce`.
Previously that subsection could cause valid reproduction steps to be missed. This patch
keeps content under nested subsections while preserving boundaries between unrelated sections.

## Changes

- Fix completeness checks for nested Markdown subsections and add regression cases.
- Update checkout and setup-node to Node.js 24-based versions, pinned to full commit SHAs.
- Run CLI checks on Node.js 22 and 24 and execute the real Action entry point in CI.
- Include the existing live Issue walkthrough, screenshots with source captions, and replay fixtures.
- Provide a versioned installable archive with no runtime dependencies.

## Install or update

GitHub Action:

```yaml
- uses: 0hell/triageproof@v0.2.2
  with:
    mode: advisory
```

Workflows using `0hell/triageproof@v0` receive this patch once the compatibility tag
is advanced. Workflows pinned to an earlier version or commit need an explicit update.

CLI (Node.js 22 or 24 recommended):

```bash
npm install -g https://github.com/0hell/triageproof/releases/download/v0.2.2/triageproof-0.2.2.tgz
triageproof check issue.md
```

This installs the release archive; the package has not been published to the npm registry.

## Verification and scope

49 automated tests cover nested and sibling headings, placeholders, fenced code,
hidden comments, CLI behavior, safe reporting, and Action advisory/strict modes.
The offline demonstration covers ready, needs-info, blocked, and sanitized inputs.

The live Issue demonstration uses synthetic content created by a maintainer.
It verifies integration, not external adoption. This release makes no API calls,
collects no telemetry, and performs no automatic Issue mutations.
