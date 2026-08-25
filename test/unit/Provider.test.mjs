import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import Provider from '../../src/Provider.mjs';

describe('TeqFw_Log_Provider', () => {
    it('creates one source-bound logger per source and shares dependencies', () => {
        /** @type {any[]} */
        const created = [];
        class Logger {
            /** @param {any} deps */
            constructor(deps) { created.push(deps); }
        }
        /** @type {any} */
        const deps = {levels: {}, loggerModule: Logger, policy: {}, recordFactory: {}, writer: {}};
        const provider = new Provider(deps);

        const first = provider.forSource('App_User_Service');

        assert.equal(first, provider.forSource('App_User_Service'));
        assert.equal(created.length, 1);
        assert.equal(created[0].levels, deps.levels);
        assert.equal(created[0].policy, deps.policy);
        assert.equal(created[0].recordFactory, deps.recordFactory);
        assert.equal(created[0].writer, deps.writer);
        assert.equal(created[0].source, 'App_User_Service');
    });
});
