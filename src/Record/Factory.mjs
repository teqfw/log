// @ts-check

/**
 * @namespace TeqFw_Log_Record_Factory
 * @description Creates immutable log-record DTOs for the base logging contract.
 * @typedef {Record<string, any>} TeqFw_Log_Record_Data
 * @typedef {{
 *   level: TeqFw_Log_Level,
 *   message: string,
 *   data?: TeqFw_Log_Record_Data,
 *   source?: string,
 *   time?: Date|string|number
 * }} TeqFw_Log_Record_Input
 * @typedef {{
 *   level: TeqFw_Log_Level,
 *   message: string,
 *   data?: Readonly<TeqFw_Log_Record_Data>,
 *   source?: string,
 *   time: Date|string|number
 * }} TeqFw_Log_Record_Dto
 */

const RECORD_TIME_NOW = () => new Date();

/**
 * @param {unknown} value
 * @returns {value is TeqFw_Log_Record_Data}
 */
export function isLogDataObject(value) {
    return (value !== null) && (typeof value === 'object') && !Array.isArray(value);
}

/**
 * @param {TeqFw_Log_Record_Input} params
 * @returns {TeqFw_Log_Record_Dto}
 */
export function createLogRecord({level, message, data, source, time}) {
    if (typeof level !== 'string') throw new Error('Log level must be a string.');
    if (typeof message !== 'string') throw new Error('Log message must be a string.');
    if ((data !== undefined) && !isLogDataObject(data)) {
        throw new Error('Log data must be an object when provided.');
    }
    if ((source !== undefined) && (typeof source !== 'string')) throw new Error('Log source must be a string when provided.');

    /** @type {TeqFw_Log_Record_Dto} */
    const record = {
        level,
        message,
        time: time ?? RECORD_TIME_NOW(),
    };
    if (source !== undefined) record.source = source;
    if (data !== undefined) record.data = Object.freeze({...data});
    return Object.freeze(record);
}

/**
 * @implements {TeqFw_Log_Record_Factory}
 */
export default class Factory {
    constructor() {
        /**
         * @param {TeqFw_Log_Record_Input} params
         * @returns {TeqFw_Log_Record_Dto}
         */
        this.create = function (params) {
            return createLogRecord(params);
        };
        Object.freeze(this);
    }
}
