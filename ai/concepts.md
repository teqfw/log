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

The package does not define transports, sinks, routing policies, batching, or logging configuration DSLs.

## Structured Data

Machine-readable metadata belongs in `data`, not inside formatted message strings.

Reserved fields such as `err`, `code`, `requestId`, `correlationId`, `traceId`, and `spanId` may be used by higher-level tooling, but the base package does not impose an event catalog.
