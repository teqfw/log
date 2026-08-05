# Changelog

## [Unreleased]

### Added

- Added `typecheck` and `lint:md` npm scripts with the JSDoc annotation and Markdown linting baseline aligned with `@teqfw/di`.
- Added `typescript-language-server` and `markdownlint-cli2` to the development dependencies.
- Added `.markdownlint.json` with the root Markdown linting rules.
- Added `.opencode/opencode.json` enabling LSP for the opencode agent.

### Changed

- Migrated package metadata from `teqfw.namespaces` to `teqfw.fw.di.namespaces`.
- Pinned the `@teqfw/di` runtime dependency to `github:teqfw/di#main`.
- Aligned `jsconfig.json` with the `@teqfw/di` baseline: enabled `strict`, mirrored the `@teqfw/di` module resolution, and pointed the TypeScript server at the installed dependency sources and type files (`node_modules/@teqfw/*/src` + `node_modules/@teqfw/*/types.d.ts`) so JSDoc annotations across the dependency tree resolve to real types.
- Replaced the obsolete distributable `ai/` documentation with `skills/teqfw-log`.
- Aligned `types.d.ts` global type aliases with the JSDoc annotations used by `src/**` and the record contract (optional `time`).
- Reworked `types.d.ts` to the validator-compatible type map: `declare global` aliases that import real types from `src/**` (per the `teqfw-platform` cross-package type-linking convention), no `$` lifecycle markers in static aliases, sorted identifiers, and a trailing `export {};`. Renamed the public type exports accordingly (`TeqFw_Log_Provider$` → `TeqFw_Log_Provider` plus `TeqFw_Log_Provider__Class`, `TeqFw_Log_Writer$` → `TeqFw_Log_Writer`, `TeqFw_Log_Record_Factory$` → `TeqFw_Log_Record_Factory`).
- Aligned `src/**` JSDoc with the `teqfw-esm-validator` rules: dropped `$` from static type references, replaced `[param]` optional brackets with the `{Type=}` form, and switched the Provider `levels` dependency to the `TeqFw_Log_Enum_Level__default` export so it is the enum value rather than the module namespace.
- Aligned the publish smoke-test consumer with the cross-package type-linking convention: it now includes the packed dependency `src` and `types.d.ts` in its `tsconfig` with `checkJs`, and installs `@types/node`.
- Closed the runtime import surface: `package.json` `exports` now exposes only the `types` condition for the `"."` entry (no `import`/`default` target). The package is consumed through DI (namespace metadata + container), `src/**` subpaths are private, and a runtime `import '@teqfw/log'` is rejected. Removed the `Provider` default-export declaration from `types.d.ts` and the direct-import example from the `teqfw-log` usage reference.
- Pinned the `typescript` development dependency to the non-native 5.9.x series so `typescript-language-server` can resolve `tsserver.js`.

### Removed

- Removed the public `@teqfw/log/bootstrap` Composition Root API. Host applications own logging assembly and lifecycle.
- Removed the dev-only `types.di.d.ts` ambient declaration and the `@teqfw/di` `paths` mapping from `jsconfig.json`; dependency JSDoc types now come from the included dependency sources.

## [0.1.0] - 2026-07-09 - Initial npm package bootstrap

### Added (0.1.0)

- Added package-root bootstrap for the future `@teqfw/log` npm package.
- Added root metadata files: `.gitignore`, `AGENTS.md`, `jsconfig.json`, `package.json`, `README.md`, and `types.d.ts`.
- Added baseline TypeScript declarations for the logging contract types and interfaces.
- Registered repository metadata and package publication identity for `@teqfw/log`.
- Added TeqFW namespace metadata for `TeqFw_Log_` mapped to `./src`.
- Added initial `src/` implementation for fixed levels, immutable records, source-bound loggers, reference console writer, and DI provider.
- Added unit and integration test suites for the logging contract and `@teqfw/di` resolution path.
- Replaced the indirect logger-factory module with a direct `TeqFw_Log_Logger` runtime module plus colocated named factory export.
- Added distributable `ai/` package documentation with agent-facing API map, concepts, and usage guidance.
