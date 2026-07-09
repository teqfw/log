# Root Level

- Path: `AGENTS.md`
- Template Version: `20260702`
- Changed: `20260709`

## Purpose

Root-level working rules for the `@teqfw/log` package repository.

This is a two-repository ADSM project: the package code lives here, and the cognitive context is mounted in `ctx/` as a separate git tree.

## Level Boundary

Defines:

- boundary between this package repository and the `ctx/` cognitive context;
- root-level protection and escalation rules.

Does NOT define:

- product meaning, requirements, or domain knowledge;
- implementation-level structure.

## Two-Repository Topology

- Product repository (this one) contains the npm package implementation and package-root metadata.
- Context repository (`ctx/`) contains the authoritative cognitive context for the package.

Consult `ctx/AGENTS.md` and `ctx/docs/` before making package decisions.

Do not mix changes between the two repositories. Do not remove, replace, or relocate `ctx/`.

## Root File Protection

Do not modify this file, `.gitignore`, or `README.md` unless explicitly instructed by the human.
