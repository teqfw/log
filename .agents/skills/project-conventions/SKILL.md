---
name: project-conventions
description: Project-wide conventions for work in the @teqfw/log repository. Use for every task that changes, tests, documents, packages, or releases this repository.
---

# Project Conventions

Apply these rules in priority order. If a rule conflicts with an applicable `AGENTS.md`, follow `AGENTS.md`.

## Repository topology

- Treat the root repository and `ctx/` as separate Git repositories.
- Treat `ctx/` as the cognitive-context repository. Consult its applicable instructions and documentation before making package decisions.
- Keep changes, Git status checks, commits, and pushes within the repository to which they belong. Do not mix their changes.

## Git workflow

- Work directly on `main` unless the task explicitly specifies another branch. Do not create working branches.
- Before starting work, fetch both repositories and ensure the local branches in use match their upstream versions.

## Communication

- Communicate with the user in Russian unless they explicitly request another language.
- Write source code, comments, documentation, commit messages, and identifiers in English.
- Report the changes made, verification performed, and remaining risks.

## Package boundaries

- Preserve `@teqfw/log` as a small logging contract, not a logging framework.
- Consume only public package entrypoints. Do not add `src/**` imports to consumers or documentation.
- Keep application logging policy, transports, storage, telemetry, and configuration outside this package's core contract.

## Validation

- Run the relevant npm tests after changes.
- Run the package publish smoke test when changing package metadata, exports, distributable files, or documentation that describes package entrypoints.
- Validate changed native ESM modules with the `teqfw-esm-validator` skill when it applies.

## File editing fallback

- Use `apply_patch` for local edits by default.
- If `apply_patch` fails because the sandbox cannot initialize `bwrap` or a network namespace, use `git apply` with a scoped unified diff.
- Do not use shell redirection, `cat`, or broad rewrite commands as an editing fallback.
- After applying a fallback patch, run `git diff --check` in each affected repository.
