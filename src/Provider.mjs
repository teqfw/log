// @ts-check

/**
 * @namespace TeqFw_Log_Provider
 * @description Root provider that returns source-bound logger instances.
 */

export default class Provider {
    /**
     * @param {{
     *   levels: {default: TeqFw_Log_Enum_Level},
     *   loggerModule: {default: TeqFw_Log_Logger__Factory},
     *   recordFactory: TeqFw_Log_Record_Factory,
     *   writer: TeqFw_Log_Console_Writer
     * }} deps
     */
    constructor({levels, loggerModule, recordFactory, writer}) {
        this.levels = levels.default;
        this.loggerModule = loggerModule;
        this.recordFactory = recordFactory;
        this.writer = writer;
        /** @type {Map<string, TeqFw_Log_Logger>} */
        this.cache = new Map();
        /**
         * @param {string} source
         * @returns {TeqFw_Log_Logger}
         */
        this.forSource = function (source) {
            const existing = this.cache.get(source);
            if (existing) return existing;

            const logger = new this.loggerModule.default({
                levels: this.levels,
                recordFactory: this.recordFactory,
                writer: this.writer,
                source,
            });
            this.cache.set(source, logger);
            return logger;
        };
        Object.freeze(this);
    }
}

export const __deps__ = Object.freeze({
    default: Object.freeze({
        levels: 'TeqFw_Log_Enum_Level',
        loggerModule: 'TeqFw_Log_Logger',
        recordFactory: 'TeqFw_Log_Record_Factory$',
        writer: 'TeqFw_Log_Console_Writer$',
    }),
});
