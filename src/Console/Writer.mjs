// @ts-check

/**
 * @namespace TeqFw_Log_Console_Writer
 * @description Reference console writer for browser and Node.js environments.
 */

export default class Writer {
    /**
     * Creates the reference console writer.
     */
    constructor() {
        /**
         * @param {unknown} err
         * @returns {unknown}
         */
        const normalizeError = function (err) {
            if (!(err instanceof Error)) return err;
            /** @type {Record<string, any>} */
            const normalized = {
                name: err.name,
                message: err.message,
                stack: err.stack,
            };
            if ('code' in err) normalized.code = err.code;
            if ('cause' in err) normalized.cause = err.cause;
            return normalized;
        };

        /**
         * @param {Date|string|number|undefined} value
         * @returns {string}
         */
        const formatTime = function (value) {
            const date = value instanceof Date ? value : new Date(value ?? NaN);
            if (Number.isNaN(date.getTime())) return 'invalid-time';

            /**
             * @param {number} number
             * @param {number} [width]
             * @returns {string}
             */
            const pad = (number, width = 2) => String(number).padStart(width, '0');
            const offsetMinutes = -date.getTimezoneOffset();
            const offsetSign = offsetMinutes >= 0 ? '+' : '-';
            const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
            const offsetRemainder = Math.abs(offsetMinutes) % 60;
            return `${pad(date.getFullYear(), 4)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
                + `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
                + `(${offsetSign}${pad(offsetHours)}:${pad(offsetRemainder)})`;
        };

        /**
         * @param {TeqFw_Log_Record} record
         * @returns {void}
         */
        this.write = function (record) {
            const consoleApi = globalThis.console;
            if (!consoleApi) return;

            const source = record.source ?? 'unknown';
            const message = `${formatTime(record.time)} [${record.level}] ${source}: ${record.message}`;
            const data = record.data ? {...record.data} : undefined;
            if (data?.err !== undefined) data.err = normalizeError(data.err);

            /** @type {(message?: any, ...optionalParams: any[]) => void} */
            let method = consoleApi.info?.bind(consoleApi) ?? consoleApi.log?.bind(consoleApi) ?? (() => {});
            if ((record.level === 'trace') || (record.level === 'debug')) {
                method = consoleApi.debug?.bind(consoleApi) ?? method;
            } else if (record.level === 'warn') {
                method = consoleApi.warn?.bind(consoleApi) ?? method;
            } else if ((record.level === 'error') || (record.level === 'fatal')) {
                method = consoleApi.error?.bind(consoleApi) ?? method;
            }

            if (data !== undefined) method(message, data);
            else method(message);
        };
        Object.freeze(this);
    }
}
