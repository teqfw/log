---
name: teqfw-log
description: Use this skill when integrating, using, testing, reviewing, or modifying JavaScript modules that consume @teqfw/log, including its DI provider, source-bound loggers, structured records, public bootstrap API, custom writers, browser or Node.js console behavior, and package metadata.
---

# @teqfw/log

Use this skill for consumer code that composes or depends on the installed `@teqfw/log` package. Treat the host project's instructions, architecture, and test conventions as authoritative.

## Apply

1. Use only the public entrypoints `@teqfw/log` and `@teqfw/log/bootstrap`; never import `@teqfw/log/src/**`.
2. Receive `TeqFw_Log_Provider` through DI or assembly, bind one stable TeqFW component source with `forSource()`, and reuse the returned logger.
3. Put a short human-readable message in `message`, machine-readable context in `data`, and caught errors in `data.err`; do not log secrets or full user payloads.
4. Create a provider only through `createBootstrap()` in a Composition Root. Configure optional writers there; do not construct internal logger or writer classes.
5. Read the selected references before editing, then validate with the host project's tests.

## Select References

| Consumer task | Read |
| --- | --- |
| Understand contract boundaries, levels, records, sources, or bootstrap behavior | [Concepts](references/concepts.md) |
| Add or change DI logging, source binding, custom writers, or application lifecycle | [Usage](references/usage.md) |
| Verify imports, TypeScript-facing APIs, or supported runtime components | [Package API](references/package-api.ts) |
| Mount or discover the installed skill | [Distribution](references/distribution.md) |

This package defines a small logging contract, not a logging framework or application policy. Keep backend routing, transports, storage, telemetry, and configuration DSLs outside its core boundary.
