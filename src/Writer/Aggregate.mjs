// @ts-check

/**
 * @namespace TeqFw_Log_Writer_Aggregate
 * @description Writes records to configured writers in declaration order and shuts them down in reverse order.
 */

/**
 * @param {unknown} error
 * @returns {void}
 */
export function reportWriterFailure(error) {
    try {
        if ((typeof process !== 'undefined') && (typeof process.stderr?.write === 'function')) {
            process.stderr.write(`[teqfw/log] writer failure: ${String(error)}\n`);
        }
    } catch {
        // Diagnostics are best-effort and must never interrupt application cleanup.
    }
}

export default class Aggregate {
    /**
     * @param {object} deps
     * @param {TeqFw_Log_Writer$[]} deps.writers
     */
    constructor({writers}) {
        if (!Array.isArray(writers) || (writers.length === 0)) {
            throw new Error('Logger bootstrap requires at least one writer.');
        }
        for (const writer of writers) {
            if (!writer || (typeof writer.write !== 'function')) {
                throw new Error('Logger writer must expose write(record).');
            }
        }
        const configuredWriters = Object.freeze([...writers]);

        /**
         * Attempts every writer in declaration order. The first failure is
         * rethrown only after later writers have received the same record.
         * Logger contains that failure so normal application work continues.
         *
         * @param {TeqFw_Log_Record} record
         * @returns {void}
         */
        this.write = function (record) {
            /** @type {unknown} */
            let firstFailure;
            for (const writer of configuredWriters) {
                try {
                    writer.write(record);
                } catch (error) {
                    if (firstFailure === undefined) firstFailure = error;
                }
            }
            if (firstFailure !== undefined) throw firstFailure;
        };

        /**
         * Closes all writers in reverse declaration order. Writer failures are
         * reported directly to guarded stderr and never stop remaining cleanup.
         *
         * @returns {void}
         */
        this.shutdown = function () {
            for (const writer of [...configuredWriters].reverse()) {
                const cleanup = writer.shutdown ?? writer.close;
                if (typeof cleanup !== 'function') continue;
                try {
                    cleanup.call(writer);
                } catch (error) {
                    reportWriterFailure(error);
                }
            }
        };
        Object.freeze(this);
    }
}
