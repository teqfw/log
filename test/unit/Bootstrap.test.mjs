import assert from 'node:assert/strict';
import {afterEach, describe, it} from 'node:test';

import {createBootstrap} from '@teqfw/log/bootstrap';

describe('Public logging bootstrap', () => {
    const originalStderrWrite = process.stderr.write;

    afterEach(() => {
        process.stderr.write = originalStderrWrite;
    });

    it('constructs a provider without importing internal logging modules', async () => {
        const records = [];
        const bootstrap = await createBootstrap({writers: [{write: (record) => records.push(record)}]});
        const logger = bootstrap.provider.forSource('App_User_Service');
        logger.info('loaded', {userId: 7});

        assert.equal(typeof bootstrap.provider.forSource, 'function');
        assert.deepEqual(records.map((record) => ({level: record.level, source: record.source})), [
            {level: 'info', source: 'App_User_Service'},
        ]);
    });

    it('writes in declaration order and continues after an individual writer fails', async () => {
        const calls = [];
        const diagnostics = [];
        process.stderr.write = (message) => {
            diagnostics.push(String(message));
            return true;
        };
        const bootstrap = await createBootstrap({writers: [
            {write: () => { calls.push('first'); throw new Error('first failed'); }},
            {write: () => calls.push('second')},
            {write: () => calls.push('third')},
        ]});

        assert.doesNotThrow(() => bootstrap.provider.forSource('App_User_Service').info('safe'));
        assert.deepEqual(calls, ['first', 'second', 'third']);
        assert.match(diagnostics.join(''), /writer failure: Error: first failed/);
    });

    it('preserves a primary error while shutdown reports writer failures and continues cleanup', async () => {
        const calls = [];
        const diagnostics = [];
        process.stderr.write = (message) => {
            diagnostics.push(String(message));
            return true;
        };
        const bootstrap = await createBootstrap({writers: [
            {write() {}, close() { calls.push('first'); }},
            {write() {}, shutdown() { calls.push('second'); throw new Error('close failed'); }},
            {write() {}, close() { calls.push('third'); }},
        ]});
        const primary = new Error('primary operational error');

        assert.throws(() => {
            try {
                throw primary;
            } finally {
                bootstrap.shutdown();
            }
        }, (error) => error === primary);
        assert.deepEqual(calls, ['third', 'second', 'first']);
        assert.match(diagnostics.join(''), /writer failure: Error: close failed/);
    });
});
