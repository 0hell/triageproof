# TriageProof v0.2.1 — Node.js 24 compatibility

This patch release updates the GitHub Action runtime from Node.js 20 to Node.js 24.

## Changes

- Remove the GitHub Actions Node.js 20 deprecation warning.
- Add a regression test that verifies `action.yml` continues to target Node.js 24.
- Keep the CLI, Action inputs, outputs, and advisory/strict behavior unchanged.

## Verification

- 45 automated tests pass.
- The offline end-to-end demonstration passes for ready, needs-info, blocked, and sanitized inputs.

Existing workflows using `0hell/triageproof@v0` receive this compatible update after the moving `v0` tag is advanced.
