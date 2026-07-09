import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import TeqFw_Log_Enum_Level from '../../../src/Enum/Level.mjs';
import TeqFw_Log_Logger from '../../../src/Logger.mjs';
import TeqFw_Log_Record_Factory from '../../../src/Record/Factory.mjs';

describe('TeqFw_Log_Logger', () => {
    const calls = [];
    const writer = {write: (record) => calls.push(record)};
    const recordFactory = new TeqFw_Log_Record_Factory();

    it('implements source-bound logger module directly', () => {
        const logger = new TeqFw_Log_Logger({
            levels: TeqFw_Log_Enum_Level,
            recordFactory,
            writer,
            source: 'App_User_Service',
        });
        logger.info('loaded', {userId: 7});

        assert.equal(typeof logger.write, 'function');
        assert.equal(calls.at(-1)?.source, 'App_User_Service');
        assert.equal(calls.at(-1)?.level, 'info');
        assert.deepEqual(calls.at(-1)?.data, {userId: 7});
    });

    it('maps helper methods to fixed levels', () => {
        const logger = new TeqFw_Log_Logger({
            levels: TeqFw_Log_Enum_Level,
            recordFactory,
            writer,
            source: 'App_Billing_Payment_Processor',
        });
        logger.trace('t');
        logger.debug('d');
        logger.info('i');
        logger.warn('w');
        logger.error('e');
        logger.fatal('f');

        assert.deepEqual(
            calls.slice(-6).map((item) => item.level),
            ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
        );
    });

    it('rejects conflicting record source', () => {
        const logger = new TeqFw_Log_Logger({
            levels: TeqFw_Log_Enum_Level,
            recordFactory,
            writer,
            source: 'App_User_Service',
        });
        assert.throws(
            () => logger.write({level: 'info', message: 'x', source: 'App_Another_Service'}),
            /conflicts with bound source/
        );
    });

    it('rejects invalid source', () => {
        assert.throws(() => new TeqFw_Log_Logger({
            levels: TeqFw_Log_Enum_Level,
            recordFactory,
            writer,
            source: 'service',
        }), /invalid/);
        assert.throws(() => new TeqFw_Log_Logger({
            levels: TeqFw_Log_Enum_Level,
            recordFactory,
            writer,
            source: 'App_User_Service$',
        }), /invalid/);
    });
});
