// @ts-check

/**
 * @namespace TeqFw_Log_Logger
 * @description Source-bound logger implementation for the TeqFW logging contract.
 */

const SOURCE_PATTERN = /^[A-Z][A-Za-z0-9]*(?:_[A-Z][A-Za-z0-9]*)+$/;

/**
 * @param {string} source
 * @returns {void}
 */
function assertSource(source) {
    if ((typeof source !== 'string') || !SOURCE_PATTERN.test(source)) {
        throw new Error(`Log source is invalid: '${String(source)}'.`);
    }
}

/**
 * @param {Set<string>} allowedLevels
 * @param {TeqFw_Log_Level} level
 * @returns {void}
 */
function assertLevel(allowedLevels, level) {
    if (!allowedLevels.has(level)) {
        throw new Error(`Log level is invalid: '${String(level)}'.`);
    }
}

export default class Logger {
    /**
     * @param {{
     *   levels: TeqFw_Log_Enum_Level,
     *   recordFactory: TeqFw_Log_Record_Factory$,
     *   writer: TeqFw_Log_Console_Writer$,
     *   source: string
     * }} deps
     */
    constructor({levels, recordFactory, writer, source}) {
        this.levelMap = levels;
        this.allowedLevels = new Set(Object.values(levels));
        this.recordFactory = recordFactory;
        this.writer = writer;
        this.source = source;
        assertSource(source);
        /**
         * @param {TeqFw_Log_Record} record
         * @returns {TeqFw_Log_Record}
         */
        const normalizeRecord = (record) => {
            if ((record === null) || (typeof record !== 'object')) {
                throw new Error('Log record must be an object.');
            }
            const inputSource = record.source;
            if ((inputSource !== undefined) && (inputSource !== this.source)) {
                throw new Error(`Log record source conflicts with bound source: '${String(inputSource)}'.`);
            }
            return this.recordFactory.create({
                level: record.level,
                message: record.message,
                data: record.data,
                source: this.source,
                time: record.time,
            });
        };

        /**
         * @param {TeqFw_Log_Level} level
         * @returns {boolean}
         */
        this.isEnabled = function (level) {
            assertLevel(this.allowedLevels, level);
            return true;
        };

        /**
         * @param {TeqFw_Log_Record} record
         * @returns {void}
         */
        this.write = function (record) {
            const normalized = normalizeRecord(record);
            this.writer.write(normalized);
        };

        /**
         * @param {TeqFw_Log_Level} level
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        this.log = function (level, message, data) {
            assertLevel(this.allowedLevels, level);
            const normalized = this.recordFactory.create({level, message, data, source: this.source});
            this.writer.write(normalized);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        this.trace = function (message, data) {
            this.log(this.levelMap.TRACE, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        this.debug = function (message, data) {
            this.log(this.levelMap.DEBUG, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        this.info = function (message, data) {
            this.log(this.levelMap.INFO, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        this.warn = function (message, data) {
            this.log(this.levelMap.WARN, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        this.error = function (message, data) {
            this.log(this.levelMap.ERROR, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        this.fatal = function (message, data) {
            this.log(this.levelMap.FATAL, message, data);
        };
        Object.freeze(this);
    }
}
