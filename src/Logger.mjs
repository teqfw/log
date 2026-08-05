// @ts-check

/**
 * @namespace TeqFw_Log_Logger
 * @description Source-bound logger implementation for the TeqFW logging contract.
 */

const SOURCE_PATTERN = /^[A-Z][A-Za-z0-9]*(?:_[A-Z][A-Za-z0-9]*)+$/;

/**
 * Reports a writer error without invoking another logger or allowing a
 * diagnostic problem to change application control flow.
 *
 * @param {unknown} error
 * @returns {void}
 */
function reportWriterFailure(error) {
    try {
        if ((typeof process !== 'undefined') && (typeof process.stderr?.write === 'function')) {
            process.stderr.write(`[teqfw/log] writer failure: ${String(error)}\n`);
        }
    } catch {
        // Guarded fallback diagnostics must remain non-throwing.
    }
}

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
     * @param {object} deps
     * @param {TeqFw_Log_Enum_Level} deps.levels
     * @param {TeqFw_Log_Record_Factory} deps.recordFactory
     * @param {TeqFw_Log_Writer} deps.writer
     * @param {string} deps.source
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
            try {
                this.writer.write(normalized);
            } catch (error) {
                reportWriterFailure(error);
            }
        };

        /**
         * @param {TeqFw_Log_Level} level
         * @param {string} message
         * @param {TeqFw_Log_Data=} data
         * @returns {void}
         */
        this.log = function (level, message, data) {
            assertLevel(this.allowedLevels, level);
            const normalized = this.recordFactory.create({level, message, data, source: this.source});
            try {
                this.writer.write(normalized);
            } catch (error) {
                reportWriterFailure(error);
            }
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data=} data
         * @returns {void}
         */
        this.trace = function (message, data) {
            this.log(this.levelMap.TRACE, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data=} data
         * @returns {void}
         */
        this.debug = function (message, data) {
            this.log(this.levelMap.DEBUG, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data=} data
         * @returns {void}
         */
        this.info = function (message, data) {
            this.log(this.levelMap.INFO, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data=} data
         * @returns {void}
         */
        this.warn = function (message, data) {
            this.log(this.levelMap.WARN, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data=} data
         * @returns {void}
         */
        this.error = function (message, data) {
            this.log(this.levelMap.ERROR, message, data);
        };

        /**
         * @param {string} message
         * @param {TeqFw_Log_Data=} data
         * @returns {void}
         */
        this.fatal = function (message, data) {
            this.log(this.levelMap.FATAL, message, data);
        };
        Object.freeze(this);
    }
}
