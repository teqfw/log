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
    ],
    structuralContracts: [
        {
            name: 'Log Provider',
            kind: 'protocol',
            aliases: ['TeqFw_Log_Provider'],
            summary: 'Public root dependency that returns source-bound loggers for stable component sources.',
            notes: [
                'This is the only supported runtime import from the published npm package.',
                'Provider instances expose forSource(source) and may cache logger instances per source.',
            ],
        },
        {
            name: 'Source-Bound Logger',
            kind: 'protocol',
            aliases: ['TeqFw_Log_Logger'],
            summary: 'Runtime logger returned by the provider for one stable TeqFW component source.',
            notes: [
                'Consumer code relies on logger instances returned by the provider rather than importing logger internals directly.',
                'Supported behavior includes isEnabled(level), write(record), log(level, message, data), and fixed-level helpers.',
            ],
        },
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
        'The npm package intentionally exposes only the root provider entrypoint; package-internal source files are not part of the supported public API.',
        'Behavior not documented in this file or the companion ai/*.md documents should be treated as unsupported.',
    ],
};
