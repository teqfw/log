# Changelog

## [2.1.0] - 2026-08-25

### Added (2.1.0)

- Added a shared mutable source-and-level Policy to the DI logging contract. The default `*=info` policy filters source-bound loggers before the Writer receives a record.
- Added programmatic Policy creation and updates through `TeqFw_Log_Policy_Factory$`, `setRules()`, and `setRule()`.
- Added explicit Node.js policy-file loading through `TeqFw_Log_Policy_File$` with atomic parsing of `pattern=level` rules.
- Added policy-aware unit and integration coverage, including the distributed consumer contract.

### Changed (2.1.0)

- Documented Policy patterns, thresholds, atomic validation, file-loading boundaries, and independent Factory-created Policy instances in the README and version-matched agent skill.
- Updated all Policy usage examples to receive Policy components through TeqFW DI rather than requesting values from the Container.
- Consolidated Logger Writer-failure handling into one internal path while preserving non-throwing logging behavior.

## [2.0.0] - 2026-08-05

### Added

- Added `typecheck` and `lint:md` npm scripts with the JSDoc annotation and Markdown linting baseline aligned with `@teqfw/di`.
- Added `typescript-language-server` and `markdownlint-cli2` to the development dependencies.
- Added `.markdownlint.json` with the root Markdown linting rules.
- Added `.opencode/opencode.json` enabling LSP for the opencode agent.
- Added `jsconfig.json` to `package.json#files` so the distributed package includes the TypeScript configuration used by consumers and agents.

### Changed

- Migrated package metadata from `teqfw.namespaces` to `teqfw.fw.di.namespaces`.
- Switched the `@teqfw/di` runtime dependency from the GitHub branch alias to the npm registry range `>=2.9.0`.
- Aligned `jsconfig.json` with the `@teqfw/di` baseline: enabled `strict`, mirrored the `@teqfw/di` module resolution, and pointed the TypeScript server at the installed dependency sources and type files (`node_modules/@teqfw/*/src` + `node_modules/@teqfw/*/types.d.ts`) so JSDoc annotations across the dependency tree resolve to real types.
- Reworked `README.md` to the TeqFW promotion pattern: npm and jsDelivr usage badges, the "Human-governed. Agent-built. Agent-ready." positioning, and the closing Agent-Driven Development section with the version-matched skill-mount command.
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
