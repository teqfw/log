# AGENTS.md

Version: 20260709

## Purpose

This file defines the `ai/` level for agent-facing package documentation included in the distributable package.

The `ai/` directory provides a compact machine-oriented interface for agents that need to understand and use `@teqfw/log` correctly.

## Level Boundary

This level defines:

- what documents exist in `ai/`;
- what each document is for;
- how an agent should navigate this directory;
- which documents describe supported usage.

This level does not define:

- repository organization;
- development workflow;
- testing strategy;
- cognitive context rules from `ctx/`;
- behavior not described by the documents in `ai/`.

## Level Map

- `AGENTS.md` - entry point for this level; defines scope, navigation, and authority.
- `concepts.md` - core concepts behind the provider/logger split and immutable log records.
- `package-api.ts` - machine-readable contract of the supported programmatic surface.
- `usage.md` - canonical usage patterns and short integration recipes.

## Reading Guide

Read documents by task:

- for supported imports and public surface, start with `package-api.ts`;
- for practical integration examples, read `usage.md`;
- for conceptual orientation, read `concepts.md`.

If the task is broad or unclear, read in this order:

1. `AGENTS.md`
2. `package-api.ts`
3. `usage.md`
4. `concepts.md`

## Authority

The documents in `ai/` define the supported agent-facing usage semantics of the package.

Agents should rely on these documents for package use and should treat behavior not described here as undefined.
