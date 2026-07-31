# Changelog

## [Unreleased]

### Changed
- Migrated package metadata from `teqfw.namespaces` to distributed `teqfw.fw.di.namespace` and `teqfw.fw.log.bootstrap` protocols.
- Added the public `@teqfw/log/bootstrap` Composition Root API.
- Contained writer failures during record emission and writer shutdown without replacing primary operational errors.
- Replaced the obsolete distributable `ai/` documentation with `skills/teqfw-log`.

## [0.1.0] - 2026-07-09 - Initial npm package bootstrap

### Added
- Added package-root bootstrap for the future `@teqfw/log` npm package.
- Added root metadata files: `.gitignore`, `AGENTS.md`, `jsconfig.json`, `package.json`, `README.md`, and `types.d.ts`.
- Added baseline TypeScript declarations for the logging contract types and interfaces.
- Registered repository metadata and package publication identity for `@teqfw/log`.
- Added TeqFW namespace metadata for `TeqFw_Log_` mapped to `./src`.
- Added initial `src/` implementation for fixed levels, immutable records, source-bound loggers, reference console writer, and DI provider.
- Added unit and integration test suites for the logging contract and `@teqfw/di` resolution path.
- Replaced the indirect logger-factory module with a direct `TeqFw_Log_Logger` runtime module plus colocated named factory export.
- Added distributable `ai/` package documentation with agent-facing API map, concepts, and usage guidance.
