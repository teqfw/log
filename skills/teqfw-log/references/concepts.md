# concepts.md

Version: 20260709

## Root Dependency

`TeqFw_Log_Provider` is the root dependency intended for DI-managed package code.

Consumers should receive the provider through TeqFW DI and derive source-bound loggers from it.

## Source-Bound Logger

`TeqFw_Log_Logger` is always bound to a stable TeqFW component source such as `App_User_Service`.

Once created, the logger should be reused for that source rather than recreated inside business methods.

## Immutable Records

`TeqFw_Log_Record` instances are immutable DTOs created by the package record factory.

The reference logger normalizes records before writing them and freezes metadata objects to keep log payloads stable after emission.

## Minimal Contract

The package defines a deliberately small logging surface:

- fixed level set;
- source-bound logger methods;
- structured `message + data` record shape;
- reference console writer.

## Runtime Policy

The Provider shares one mutable `TeqFw_Log_Policy` with every bound logger. Its default rule is `*=info`; a rule's level is a threshold. Rules are `*`, exact TeqFW sources, or a trailing source-prefix `*`, and the longest literal match wins. Policy, not Writer, decides whether a record is enabled. Changing its rules immediately affects existing loggers.

`@teqfw/log` owns the compact policy-file grammar (`pattern=level`, with blank lines and `#` comments) and explicit `TeqFw_Log_Policy_File$` loading. It does not locate host files or depend on cfg.

The package does not define transports, sinks, batching, configuration discovery, or an application bootstrap API.

## Host Composition Root

`@teqfw/log` does not construct a logging provider outside DI. The host application owns Container setup, writer selection, lifecycle, and shutdown policy. Package and application modules receive `TeqFw_Log_Provider` through DI or another host-owned assembly boundary.

Internal `src/**` modules, including the logger, level map, record factory, and writer implementations, are not public import APIs.

## Structured Data

Machine-readable metadata belongs in `data`, not inside formatted message strings.

Reserved fields such as `err`, `code`, `requestId`, `correlationId`, `traceId`, and `spanId` may be used by higher-level tooling, but the base package does not impose an event catalog.
