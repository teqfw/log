---
name: project-conventions
description: Project-specific conventions. Use for every task in this repository.
---

# Project Conventions

`AGENTS.md` overrides this file.

## Repositories

- The root and `ctx/` are separate Git repositories; do not mix Git operations.
- `ctx/` is the cognitive-context repository; consult its instructions and documentation before package decisions.

## Workflow

- Work in the repository's `main` branch. This project rule overrides any GitHub-skill instruction to use a separate branch.
- At the start of work, check upstream in the root and `ctx/`; keep each local `main` synchronized by fast-forwarding when safe.
- Before changes, inspect every affected working tree.
- Do not commit or push unless the user requests it.

## Communication

- User: Russian unless requested otherwise; code, comments, docs, commits, identifiers: English.
- Report changes, verification, and remaining risks.

## Shared memory

- `flancer32/ai-memo` is the shared cross-project issue tracker and memory.
- May create issues: source `teqfw/log`; name the project or projects expected to resolve them.
- In GitHub issue descriptions and comments, use actual line breaks; literal `\n` is displayed as text.
- When referring to a commit in another repository, use its full GitHub URL: `https://github.com/vendor/name/commit/<sha>`.
- Notes: `project/teqfw/log/`.

## Package boundaries

- Preserve `@teqfw/log` as a small logging contract, not a logging framework.
- Consume public package entrypoints only; do not add `src/**` imports to consumers or docs.
- Keep application logging policy, transports, storage, telemetry, and configuration outside its core contract.

## Validation

- Run relevant npm tests after changes.
- Run the publish smoke test when changing package metadata, exports, distributable files, or docs describing package entrypoints.
- Validate changed native ESM modules with `teqfw-esm-validator` when applicable.

## File editing fallback

- Use `apply_patch`; on `bwrap` or network-namespace failure, use scoped `git apply`.
- Do not use shell redirection, `cat`, or broad rewrites; after fallback, run `git diff --check` in each affected repository.
