# Demonstration report

This is a maintainer-created synthetic example for the README, not a product defect.
This revision adds the information intentionally omitted from the first version.

## Steps to reproduce

1. Clone https://github.com/0hell/triageproof and open the repository directory.
2. Run `node bin/triageproof.js check examples/incomplete-issue.md`.
3. Read the completeness score and the list of missing sections.

## Environment

Windows 11, Node.js 22.12.0 (example environment).

## Expected behavior

The command reports 25/100 completeness, identifies missing reproduction steps,
expected behavior, and actual behavior, and exits with code 1.

## Actual behavior

The command reports Needs information with 25/100 completeness and exits with code 1.
This is the intended behavior being demonstrated; no product defect is claimed.
