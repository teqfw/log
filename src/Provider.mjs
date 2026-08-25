// @ts-check

/**
 * @namespace TeqFw_Log_Provider
 * @description Root provider that returns source-bound logger instances.
 */

export default class Provider {
    /**
     * @param {object} deps
     * @param {TeqFw_Log_Enum_Level} deps.levels
     * @param {TeqFw_Log_Logger__Class} deps.loggerModule
     * @param {TeqFw_Log_Policy} deps.policy
     * @param {TeqFw_Log_Record_Factory} deps.recordFactory
     * @param {TeqFw_Log_Writer} deps.writer
     */
    constructor({levels, loggerModule, policy, recordFactory, writer}) {
        this.levels = levels;
        this.loggerModule = loggerModule;
        this.policy = policy;
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

            const logger = new this.loggerModule({
                levels: this.levels,
                policy: this.policy,
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
        levels: 'TeqFw_Log_Enum_Level__default',
        loggerModule: 'TeqFw_Log_Logger__default',
        policy: 'TeqFw_Log_Policy$',
        recordFactory: 'TeqFw_Log_Record_Factory$',
        writer: 'TeqFw_Log_Console_Writer$',
    }),
});
