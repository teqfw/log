import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import Logger from '../../src/Logger.mjs';

const levels = Object.freeze({
    TRACE: 'trace', DEBUG: 'debug', INFO: 'info', WARN: 'warn', ERROR: 'error', FATAL: 'fatal',
});

describe('TeqFw_Log_Logger', () => {
    it('binds records to its source and maps helper methods to fixed levels', () => {
        /** @type {any[]} */
        const calls = [];
        /** @type {any} */
        const policy = {isEnabled: () => true};
        /** @type {any} */
        const recordFactory = {create: (/** @type {any} */ record) => Object.freeze({...record, time: new Date()})};
        const logger = new Logger({
            levels,
            policy,
            recordFactory,
            writer: {write: (record) => calls.push(record)},
            source: 'App_User_Service',
        });

        logger.info('loaded', {userId: 7});

        assert.equal(calls.length, 1);
        assert.equal(calls[0].level, 'info');
        assert.equal(calls[0].message, 'loaded');
        assert.deepEqual(calls[0].data, {userId: 7});
        assert.equal(calls[0].source, 'App_User_Service');
    });

    it('rejects conflicting or invalid bound sources', () => {
        /** @type {any} */
        const policy = {isEnabled: () => true};
        /** @type {any} */
        const recordFactory = {create: (/** @type {any} */ record) => Object.freeze({...record, time: new Date()})};
        const logger = new Logger({
            levels,
            policy,
            recordFactory,
            writer: {write: () => {}},
            source: 'App_User_Service',
        });

        assert.throws(() => logger.write({level: 'info', message: 'x', source: 'App_Another_Service'}), /conflicts with bound source/);
        assert.throws(() => new Logger({
            levels, policy, recordFactory, writer: {write: () => {}}, source: 'service',
        }), /invalid/);
    });
});
