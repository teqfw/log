---
name: teqfw-log
description: Use this skill when integrating, using, testing, reviewing, or modifying JavaScript modules that consume @teqfw/log, including its DI provider, source-bound loggers, structured records, shared Policy configuration, browser or Node.js console behavior, and package metadata.
---

# @teqfw/log

Use this skill for consumer code that composes or depends on the installed `@teqfw/log` package. Treat the host project's instructions, architecture, and test conventions as authoritative.

## Apply

1. Use only the public entrypoint `@teqfw/log`; never import `@teqfw/log/src/**`.
2. Receive `TeqFw_Log_Provider` through DI or assembly, bind one stable TeqFW component source with `forSource()`, and reuse the returned logger.
3. Put a short human-readable message in `message`, machine-readable context in `data`, and caught errors in `data.err`; do not log secrets or full user payloads.
4. Let the host application's Composition Root configure the Container and shared `TeqFw_Log_Policy$`; do not construct internal logger or writer classes.
5. Configure Policy only through its DI components. Preserve the required `*` default rule, and do not assume an independent Policy created by the Factory replaces a Provider's shared Policy.
6. Read the selected references before editing, then validate with the host project's tests.

## Select References

| Consumer task | Read |
| --- | --- |
| Understand contract boundaries, levels, records, or sources | [Concepts](references/concepts.md) |
| Add or change DI logging or source binding | [Usage](references/usage.md) |
| Configure, load, test, or review logging Policy | [Concepts](references/concepts.md), [Usage](references/usage.md), [Package API](references/package-api.ts) |
| Verify imports, TypeScript-facing APIs, or supported runtime components | [Package API](references/package-api.ts) |
| Mount or discover the installed skill | [Distribution](references/distribution.md) |

The package owns source-and-level Policy semantics and policy-file parsing, but never discovers host configuration. Keep backend routing, transports, storage, telemetry, and configuration discovery outside its core boundary.
