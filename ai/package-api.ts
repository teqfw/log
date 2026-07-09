export type ApiExposure =
    | 'public-runtime'
    | 'public-structural'
    | 'internal';

export interface ImportBinding {
    readonly specifier: string;
    readonly exportName: 'default' | string;
    readonly canonical: boolean;
    readonly note?: string;
}

export interface MethodContract {
    readonly name: string;
    readonly signature: string;
    readonly summary: string;
    readonly constraints?: readonly string[];
}

export interface RuntimeComponentContract {
    readonly alias: string;
    readonly kind: 'factory' | 'callable';
    readonly role: string;
    readonly imports: readonly ImportBinding[];
    readonly methods: readonly MethodContract[];
}

export interface StructuralContract {
    readonly name: string;
    readonly kind: 'dto' | 'enum' | 'protocol';
    readonly summary: string;
    readonly aliases?: readonly string[];
    readonly fields?: Readonly<Record<string, string>>;
    readonly values?: Readonly<Record<string, string>>;
    readonly notes?: readonly string[];
}

export interface PackageApiContract {
    readonly packageName: '@teqfw/log';
    readonly packageRole: string;
    readonly canonicalEntrypoints: readonly string[];
    readonly publicRuntime: readonly RuntimeComponentContract[];
    readonly structuralContracts: readonly StructuralContract[];
    readonly operationalNotes: readonly string[];
}

/**
 * Public package contract intended for agents that consume `@teqfw/log`
 * as an npm dependency.
 *
 * This file distinguishes between:
 * - importable runtime API supported by `package.json#exports`
 * - structural contracts that external code may rely on indirectly
 * - internal implementation details that are not part of the supported surface
 */
export const PACKAGE_API: PackageApiContract = {
    packageName: '@teqfw/log',
    packageRole: 'Minimal TeqFW logging contract with a DI root provider, source-bound logger, immutable log records, and a reference console writer.',
    canonicalEntrypoints: [
        '@teqfw/log',
        '@teqfw/log/src/Logger.mjs',
        '@teqfw/log/src/Enum/Level.mjs',
        '@teqfw/log/src/Record/Factory.mjs',
        '@teqfw/log/src/Console/Writer.mjs',
    ],
    publicRuntime: [
        {
            alias: 'TeqFw_Log_Provider',
            kind: 'factory',
            role: 'Root runtime provider that returns source-bound loggers and is intended to be injected through TeqFW DI.',
            imports: [
                {
                    specifier: '@teqfw/log',
                    exportName: 'default',
                    canonical: true,
                },
                {
                    specifier: '@teqfw/log/src/Provider.mjs',
                    exportName: 'default',
                    canonical: false,
                    note: 'Explicit source subpath export. Prefer the package root import for the provider.',
                },
            ],
            methods: [
                {
                    name: 'forSource',
                    signature: 'forSource(source: string): TeqFw_Log_Logger',
                    summary: 'Returns a source-bound logger for one stable TeqFW component address.',
                    constraints: [
                        'The source must match the TeqFW component-style underscore address pattern.',
                        'The provider may cache and reuse one logger instance per source.',
                    ],
                },
            ],
        },
        {
            alias: 'TeqFw_Log_Logger',
            kind: 'factory',
            role: 'Creates a source-bound logger that validates levels, normalizes records, and writes through the configured sink.',
            imports: [
                {
                    specifier: '@teqfw/log/src/Logger.mjs',
                    exportName: 'default',
                    canonical: true,
                },
            ],
            methods: [
                {
                    name: 'isEnabled',
                    signature: 'isEnabled(level: TeqFw_Log_Level): boolean',
                    summary: 'Checks whether a level is valid and enabled for the bound logger.',
                },
                {
                    name: 'write',
                    signature: 'write(record: TeqFw_Log_Record): void',
                    summary: 'Writes one log record using the bound source unless the record already carries the same source.',
                    constraints: [
                        'A record source that conflicts with the bound source is invalid.',
                    ],
                },
                {
                    name: 'log',
                    signature: 'log(level: TeqFw_Log_Level, message: string, data?: TeqFw_Log_Data): void',
                    summary: 'Writes one structured log entry for the provided level.',
                },
                {
                    name: 'trace/debug/info/warn/error/fatal',
                    signature: '(message: string, data?: TeqFw_Log_Data): void',
                    summary: 'Level-specific convenience helpers over `log(...)`.',
                },
            ],
        },
        {
            alias: 'TeqFw_Log_Record_Factory',
            kind: 'factory',
            role: 'Creates immutable record DTOs that follow the base logging contract.',
            imports: [
                {
                    specifier: '@teqfw/log/src/Record/Factory.mjs',
                    exportName: 'default',
                    canonical: true,
                },
            ],
            methods: [
                {
                    name: 'create',
                    signature: 'create(params: TeqFw_Log_Record_Input): TeqFw_Log_Record',
                    summary: 'Builds and freezes one log record DTO.',
                },
            ],
        },
        {
            alias: 'TeqFw_Log_Console_Writer',
            kind: 'factory',
            role: 'Reference writer that maps structured log records to the host console API.',
            imports: [
                {
                    specifier: '@teqfw/log/src/Console/Writer.mjs',
                    exportName: 'default',
                    canonical: true,
                },
            ],
            methods: [
                {
                    name: 'write',
                    signature: '(record: TeqFw_Log_Record): void',
                    summary: 'Writes one normalized record to `console.debug/info/warn/error` depending on level.',
                },
            ],
        },
    ],
    structuralContracts: [
        {
            name: 'Log Level',
            kind: 'enum',
            aliases: ['TeqFw_Log_Level', 'TeqFw_Log_Enum_Level'],
            summary: 'Fixed set of allowed levels used by the base logging contract.',
            values: {
                TRACE: 'trace',
                DEBUG: 'debug',
                INFO: 'info',
                WARN: 'warn',
                ERROR: 'error',
                FATAL: 'fatal',
            },
        },
        {
            name: 'Log Record',
            kind: 'dto',
            aliases: ['TeqFw_Log_Record'],
            summary: 'Immutable structured record written by source-bound loggers.',
            fields: {
                level: 'Required log level.',
                message: 'Required human-readable message.',
                data: 'Optional machine-readable metadata object.',
                source: 'Optional TeqFW component source; bound loggers fill it automatically.',
                time: 'Timestamp value added by the record factory when omitted.',
            },
        },
        {
            name: 'Log Data',
            kind: 'protocol',
            aliases: ['TeqFw_Log_Data'],
            summary: 'Open metadata object carried alongside the log message.',
            notes: [
                'Reserved keys include err, code, requestId, correlationId, traceId, and spanId.',
                'The base contract does not require an event field.',
            ],
        },
    ],
    operationalNotes: [
        'Package code should usually depend on TeqFw_Log_Provider rather than construct loggers directly.',
        'Bind one stable source once and reuse the returned logger.',
        'Behavior not documented in this file or the companion ai/*.md documents should be treated as unsupported.',
    ],
};
