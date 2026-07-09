// @ts-check

/**
 * @namespace TeqFw_Log_Provider
 * @description Root provider that returns source-bound logger instances.
 * @typedef {typeof import('./Enum/Level.mjs').default} TeqFw_Log_Provider_Levels
 * @typedef {typeof import('./Logger.mjs')} TeqFw_Log_Provider_LoggerModule
 * @typedef {{create: typeof import('./Record/Factory.mjs').createLogRecord}} TeqFw_Log_Provider_RecordFactory
 * @typedef {ReturnType<typeof import('./Console/Writer.mjs').default>} TeqFw_Log_Provider_Writer
 * @typedef {ReturnType<typeof import('./Logger.mjs').default>} TeqFw_Log_Provider_Logger
 * @typedef {object} TeqFw_Log_Provider_Api
 * @property {(source: string) => TeqFw_Log_Provider_Logger} forSource
 */

const LOGGER_CACHE = new Map();

/**
 * @param {{
 *   levels: TeqFw_Log_Provider_Levels,
 *   loggerModule: TeqFw_Log_Provider_LoggerModule,
 *   recordFactory: TeqFw_Log_Provider_RecordFactory,
 *   writer: TeqFw_Log_Provider_Writer
 * }} deps
 * @returns {TeqFw_Log_Provider_Api}
 */
export default function TeqFw_Log_Provider({levels, loggerModule, recordFactory, writer}) {
    /** @type {Map<string, TeqFw_Log_Provider_Logger>} */
    const cache = new Map(LOGGER_CACHE);

    return Object.freeze(/** @type {TeqFw_Log_Provider_Api} */ ({
        /**
         * @param {string} source
         * @returns {TeqFw_Log_Provider_Logger}
         */
        forSource(source) {
            const existing = cache.get(source);
            if (existing) return existing;

            const logger = loggerModule.default({
                levels,
                recordFactory,
                writer,
                source,
            });
            cache.set(source, logger);
            return logger;
        },
    }));
}

export const __deps__ = Object.freeze({
    default: Object.freeze({
        levels: 'TeqFw_Log_Enum_Level',
        loggerModule: 'TeqFw_Log_Logger',
        recordFactory: 'TeqFw_Log_Record_Factory$',
        writer: 'TeqFw_Log_Console_Writer$',
    }),
});
