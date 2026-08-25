import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import File from '../../../src/Policy/File.mjs';

describe('TeqFw_Log_Policy_File', () => {
    it('passes explicitly loaded text to the shared policy', async () => {
        let received;
        /** @type {any} */
        const policy = {applyText: (/** @type {string} */ text) => { received = text; }};
        const file = new File({
            policy,
            readFile: async (path, encoding) => {
                assert.equal(path, '/etc/log.policy');
                assert.equal(encoding, 'utf8');
                return '*=error\n';
            },
        });

        await file.apply('/etc/log.policy');

        assert.equal(received, '*=error\n');
    });

    it('rejects invalid paths and non-text input', async () => {
        /** @type {any} */
        const policy = {applyText: () => {}};
        const file = new File({policy, readFile: async () => Buffer.from('x')});
        await assert.rejects(() => file.apply(''), /path is invalid/);
        await assert.rejects(() => file.apply('/etc/log.policy'), /must return text/);
    });
});
