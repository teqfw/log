// @ts-check

/**
 * @namespace TeqFw_Log_Logger
 * @description Source-bound logger implementation for the TeqFW logging contract.
 * @typedef {typeof import('./Enum/Level.mjs').default} TeqFw_Log_Logger_Levels
 * @typedef {{create: typeof import('./Record/Factory.mjs').createLogRecord}} TeqFw_Log_Logger_RecordFactory
 * @typedef {ReturnType<typeof import('./Console/Writer.mjs').default>} TeqFw_Log_Logger_Writer
 * @typedef {object} TeqFw_Log_Logger_Api
 * @property {(level: TeqFw_Log_Level) => boolean} isEnabled
 * @property {(record: TeqFw_Log_Record) => void} write
 * @property {(level: TeqFw_Log_Level, message: string, data?: TeqFw_Log_Data) => void} log
 * @property {(message: string, data?: TeqFw_Log_Data) => void} trace
 * @property {(message: string, data?: TeqFw_Log_Data) => void} debug
 * @property {(message: string, data?: TeqFw_Log_Data) => void} info
 * @property {(message: string, data?: TeqFw_Log_Data) => void} warn
 * @property {(message: string, data?: TeqFw_Log_Data) => void} error
 * @property {(message: string, data?: TeqFw_Log_Data) => void} fatal
 */

const SOURCE_PATTERN = /^[A-Z][A-Za-z0-9]*(?:_[A-Z][A-Za-z0-9]*)+$/;

/**
 * @param {TeqFw_Log_Logger_Levels | {default: TeqFw_Log_Logger_Levels}} levels
 * @returns {{levelMap: TeqFw_Log_Logger_Levels, allowedLevels: Set<string>}}
 */
function resolveLevels(levels) {
    const levelMap = ('default' in levels) ? levels.default : levels;
    return {
        levelMap,
        allowedLevels: new Set(Object.values(levelMap)),
    };
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

/**
 * @param {{
 *   levels: TeqFw_Log_Logger_Levels | {default: TeqFw_Log_Logger_Levels},
 *   recordFactory: TeqFw_Log_Logger_RecordFactory,
 *   writer: TeqFw_Log_Logger_Writer,
 *   source: string
 * }} deps
 * @returns {TeqFw_Log_Logger_Api}
 */
export default function TeqFw_Log_Logger({levels, recordFactory, writer, source}) {
    const {levelMap, allowedLevels} = resolveLevels(levels);
    assertSource(source);

    /**
     * @param {TeqFw_Log_Record} record
     * @returns {TeqFw_Log_Record}
     */
    const normalizeRecord = function (record) {
        if ((record === null) || (typeof record !== 'object')) {
            throw new Error('Log record must be an object.');
        }
        const inputSource = record.source;
        if ((inputSource !== undefined) && (inputSource !== source)) {
            throw new Error(`Log record source conflicts with bound source: '${String(inputSource)}'.`);
        }
        return recordFactory.create({
            level: record.level,
            message: record.message,
            data: record.data,
            source,
            time: record.time,
        });
    };

    return Object.freeze(/** @type {TeqFw_Log_Logger_Api} */ ({
        /**
         * @param {TeqFw_Log_Level} level
         * @returns {boolean}
         */
        isEnabled(level) {
            assertLevel(allowedLevels, level);
            return true;
        },
        /**
         * @param {TeqFw_Log_Record} record
         * @returns {void}
         */
        write(record) {
            const normalized = normalizeRecord(record);
            writer(normalized);
        },
        /**
         * @param {TeqFw_Log_Level} level
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        log(level, message, data) {
            assertLevel(allowedLevels, level);
            const normalized = recordFactory.create({level, message, data, source});
            writer(normalized);
        },
        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        trace(message, data) {
            this.log(levelMap.TRACE, message, data);
        },
        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        debug(message, data) {
            this.log(levelMap.DEBUG, message, data);
        },
        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        info(message, data) {
            this.log(levelMap.INFO, message, data);
        },
        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        warn(message, data) {
            this.log(levelMap.WARN, message, data);
        },
        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        error(message, data) {
            this.log(levelMap.ERROR, message, data);
        },
        /**
         * @param {string} message
         * @param {TeqFw_Log_Data} [data]
         * @returns {void}
         */
        fatal(message, data) {
            this.log(levelMap.FATAL, message, data);
        },
    }));
}
