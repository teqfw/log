import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import Factory, {createLogRecord, isLogDataObject} from '../../../src/Record/Factory.mjs';

describe('TeqFw_Log_Record_Factory', () => {
    it('creates immutable records with immutable shallow metadata', () => {
        const record = new Factory().create({level: 'info', message: 'loaded', data: {userId: 7}, source: 'App_User_Service'});

        assert.equal(Object.isFrozen(record), true);
        assert.equal(Object.isFrozen(record.data), true);
        assert.equal(record.source, 'App_User_Service');
    });

    it('validates record data and input types', () => {
        assert.equal(isLogDataObject({}), true);
        assert.equal(isLogDataObject([]), false);
        assert.throws(() => createLogRecord({level: 'info', message: 'x', data: []}), /must be an object/);
    });
});
