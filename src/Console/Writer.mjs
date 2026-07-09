// @ts-check

/**
 * @namespace TeqFw_Log_Console_Writer
 * @description Reference console writer for browser and Node.js environments.
 */

export default class Writer {
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
         * @param {TeqFw_Log_Record} record
         * @returns {void}
         */
        this.write = function (record) {
            const consoleApi = globalThis.console;
            if (!consoleApi) return;

            const source = record.source ?? 'unknown';
            const message = `[${record.level}] ${source}: ${record.message}`;
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
