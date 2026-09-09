# Maintainer publish checklist

This page is the short path from a green local `npm run check` to public distribution.
It does not replace CI. Run every step on a clean `main` that matches the intended tag.

## Before tagging

1. `npm run check` passes locally.
2. `package.json` `version`, CLI `--version`, and the release notes agree.
3. `CHANGELOG.md` has a dated section for this version.
4. README status lines (English and Simplified Chinese) mention this version.
5. `action.yml` still uses `node24` and keeps a read-only description.
6. No secret values, private pilot notes, or live issue bodies are staged.

## Publish the GitHub release

```bash
git tag -a vX.Y.Z -m "TriageProof vX.Y.Z"
git push origin main vX.Y.Z
npm pack
```

On GitHub → **Releases → Draft a new release**:

1. Choose tag `vX.Y.Z`.
2. Title it `TriageProof vX.Y.Z`.
3. Paste the matching `docs/RELEASE_X.Y.Z.md` body.
4. Upload the `triageproof-X.Y.Z.tgz` produced by `npm pack`.
5. For an Action version, keep **Publish this Action to the GitHub Marketplace** checked.
6. Publish the release.
7. If the moving Action tag should follow, force-update the lightweight `v0` tag after CI is green:

```bash
git tag -f v0 vX.Y.Z
git push origin v0 --force
```

Only advance `v0` after the hosted CI matrix and `action-smoke` job are green on that commit.

## Marketplace listing notes

The Marketplace card uses `action.yml` metadata:

| Field | Source |
| --- | --- |
| Display name | `name` |
| Public summary | `description` (keep under 125 characters) |
| Icon / color | `branding` |
| Install snippet | the release tag users should pin |

GitHub only lists public Actions. Re-publishing an existing Action version requires an explicit Marketplace update from the release page. A green workflow is not a Marketplace listing.

## npm registry

The package is still published from GitHub Release archives by default. When the npm token is ready:

```bash
npm login
npm publish --access public
```

`prepublishOnly` runs `npm run check`. The package ships source, CLI, examples, and Markdown docs only — no screenshots, no runtime dependencies.

After the first successful publish, update both READMEs to show:

```bash
npm install -g triageproof
```

Keep the GitHub Release archive path documented as the offline fallback.

## Pilot and promotion follow-up

- Ask early pilot repositories for public-safe feedback via the issue template.
- Do not claim adoption without maintainer confirmation.
- Record aggregate counts only; never store issue bodies or secret values.
- External pilot evidence belongs in `APPLICATION_EVIDENCE.md` after consent, not in release notes.
