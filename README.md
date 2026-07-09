# @teqfw/log

`@teqfw/log` is the base logging contract package for the TeqFW platform.

It defines the smallest stable logging surface that TeqFW packages may depend on without coupling themselves to a concrete backend.

## Scope

- source-bound logger contract for TeqFW packages;
- fixed log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`;
- structured record shape based on `message + data`;
- reserved data fields for errors and tracing;
- future reference console logger for browser and Node.js.

## Status

This repository is initialized as a future npm package.

Package-root metadata and declaration files are in place, but runtime source modules and tests have not been added yet.

## Context

The cognitive context is maintained in `ctx/` as a separate repository mounted into this package repository.

Start with:

- `ctx/docs/product/overview.md` for product intent;
- `ctx/docs/architecture/contract.md` for the logging contract;
- `ctx/docs/code/usage-patterns.md` for canonical package usage.
