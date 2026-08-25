import assert from 'node:assert/strict';
import {afterEach, beforeEach, describe, it} from 'node:test';

import TeqFw_Log_Console_Writer from '../../../src/Console/Writer.mjs';

describe('TeqFw_Log_Console_Writer', () => {
    const originalConsole = globalThis.console;
    /** @type {{method: string, args: any[]}[]} */
    const calls = [];

    beforeEach(() => {
        calls.length = 0;
        /** @type {Record<string, (...args: any[]) => void>} */
        const mock = {
            debug: (...args) => calls.push({method: 'debug', args}),
            info: (...args) => calls.push({method: 'info', args}),
            warn: (...args) => calls.push({method: 'warn', args}),
            error: (...args) => calls.push({method: 'error', args}),
            log: (...args) => calls.push({method: 'log', args}),
        };
        globalThis.console = /** @type {any} */ (mock);
    });

    afterEach(() => {
        globalThis.console = originalConsole;
    });

    it('maps levels to deterministic console methods', () => {
        const writer = new TeqFw_Log_Console_Writer();
        writer.write({level: 'trace', message: 't', source: 'App_A'});
        writer.write({level: 'debug', message: 'd', source: 'App_A'});
        writer.write({level: 'info', message: 'i', source: 'App_A'});
        writer.write({level: 'warn', message: 'w', source: 'App_A'});
        writer.write({level: 'error', message: 'e', source: 'App_A'});
        writer.write({level: 'fatal', message: 'f', source: 'App_A'});

        assert.deepEqual(
            calls.map((item) => item.method),
            ['debug', 'debug', 'info', 'warn', 'error', 'error']
        );
    });

    it('prefixes messages with local record time including milliseconds and UTC offset', () => {
        const writer = new TeqFw_Log_Console_Writer();
        const time = new Date(2026, 7, 25, 10, 20, 30, 456);
        const offsetMinutes = -time.getTimezoneOffset();
        const offsetSign = offsetMinutes >= 0 ? '+' : '-';
        const offsetHours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0');
        const offsetRemainder = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');

        writer.write({level: 'info', message: 'loaded', source: 'App_A', time});

        assert.equal(
            calls[0].args[0],
            `20260825-102030.456(${offsetSign}${offsetHours}:${offsetRemainder}) [info] App_A: loaded`
        );
    });

    it('preserves error details in data.err', () => {
        const writer = new TeqFw_Log_Console_Writer();
        const cause = new Error('root cause');
        /** @type {Error & {code?: string}} */
        const err = new Error('broken', {cause});
        err.code = 'E_TEST';
        writer.write({
            level: 'error',
            message: 'failed',
            source: 'App_A',
            data: {err, requestId: 'req-1'},
        });

        assert.equal(calls.length, 1);
        assert.equal(calls[0].method, 'error');
        assert.equal(calls[0].args[1].requestId, 'req-1');
        assert.equal(calls[0].args[1].err.name, 'Error');
        assert.equal(calls[0].args[1].err.message, 'broken');
        assert.equal(calls[0].args[1].err.stack, err.stack);
        assert.equal(calls[0].args[1].err.code, 'E_TEST');
        assert.equal(calls[0].args[1].err.cause, cause);
    });
});
