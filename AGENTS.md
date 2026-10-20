# AGENTS.md — format-utils

## Build

- No build step required.

## Test

- Run `npm test`.

## CI (repository standard — REQUIRED for every PR)

This repository uses GitHub Actions for CI. The CI workflow lives at
`.github/workflows/ci.yml`. Repository policy:

- **Every pull request MUST include an up-to-date CI workflow file.** If
  `.github/workflows/ci.yml` is missing from the branch, create it as part of
  your changes — CI will not pass otherwise.
- The standard workflow: triggers on `pull_request` and `push`, checks out the
  code, runs `npm install` and `npm test`, and echoes `CI_BOOT_OK` as a health
  marker.

PRs without CI configuration will be rejected by the maintainers.
