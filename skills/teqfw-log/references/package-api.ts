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
    readonly typeEntrypoints: readonly string[];
    readonly diComponents: readonly RuntimeComponentContract[];
    readonly structuralContracts: readonly StructuralContract[];
    readonly operationalNotes: readonly string[];
}

/**
 * Public package contract intended for agents that consume `@teqfw/log`
 * as an npm dependency.
 *
 * This file distinguishes between:
 * - DI runtime components resolved through namespace metadata
 * - structural contracts that external code may rely on indirectly
 * - internal implementation details that are not part of the supported surface
 */
export const PACKAGE_API: PackageApiContract = {
    packageName: '@teqfw/log',
    packageRole: 'Minimal TeqFW logging contract with a DI root provider, shared mutable Policy, source-bound loggers, immutable records, and a reference console writer.',
    typeEntrypoints: ['@teqfw/log'],
    diComponents: [
        {
            alias: 'TeqFw_Log_Provider',
            kind: 'factory',
            role: 'Root runtime provider that returns source-bound loggers and is intended to be injected through TeqFW DI.',
            imports: [],
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
            alias: 'TeqFw_Log_Policy',
            kind: 'factory',
            role: 'Shared mutable source-and-level threshold policy used by Provider loggers.',
            imports: [],
            methods: [
                {name: 'setRules', signature: 'setRules(rules: Record<string, TeqFw_Log_Level>): void', summary: 'Atomically replaces validated rules.'},
                {name: 'setRule', signature: 'setRule(pattern: string, level: TeqFw_Log_Level): void', summary: 'Adds or changes one live rule.'},
                {name: 'applyText', signature: 'applyText(text: string): void', summary: 'Atomically parses and applies log-owned policy-file text.'},
                {name: 'getRules', signature: 'getRules(): Readonly<Record<string, TeqFw_Log_Level>>', summary: 'Returns the active rules as an immutable snapshot.'},
                {name: 'isEnabled', signature: 'isEnabled(source: string, level: TeqFw_Log_Level): boolean', summary: 'Uses the most specific matching source rule.'},
            ],
        },
        {
            alias: 'TeqFw_Log_Policy_Factory',
            kind: 'factory',
            role: 'Creates independent Policy instances from a programmatic source-rule record.',
            imports: [],
            methods: [
                {name: 'create', signature: 'create(rules: Record<string, TeqFw_Log_Level>): TeqFw_Log_Policy', summary: 'Validates and returns a new mutable policy.'},
            ],
        },
        {
            alias: 'TeqFw_Log_Policy_File',
            kind: 'factory',
            role: 'Node.js-only loader that reads and explicitly applies a policy file to the shared Policy.',
            imports: [],
            methods: [
                {name: 'apply', signature: 'apply(path: string): Promise<void>', summary: 'Reads UTF-8 text from an explicit path and atomically applies it.'},
            ],
        },
    ],
    structuralContracts: [
        {
            name: 'Logging Policy',
            kind: 'protocol',
            aliases: ['TeqFw_Log_Policy', 'TeqFw_Log_Policy_File'],
            summary: 'Mutable log-owned filtering policy and explicit Node.js policy-file loader.',
            notes: [
                'The default is *=info; a complete rule set must include *.',
                'Patterns are *; exact TeqFW sources; or source prefixes ending in one *; the longest literal match wins.',
                'Policy files use one pattern=level rule per line; log never discovers their paths.',
                'Factory-created Policies are independent and are not automatically installed into a Provider.',
            ],
        },
        {
            name: 'Log Provider',
            kind: 'protocol',
            aliases: ['TeqFw_Log_Provider'],
            summary: 'Public root dependency that returns source-bound loggers for stable component sources.',
            notes: [
                'This DI component entrypoint is supported for Container configuration and provider injection.',
                'The host application owns Container configuration and provider lifecycle.',
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
        'The @teqfw/log package root exposes TypeScript declarations only and must not be imported at runtime.',
        'The npm package exposes only @teqfw/log; package-internal source files are not supported public APIs.',
        'Behavior not documented in this file or the companion skill references should be treated as unsupported.',
    ],
};
