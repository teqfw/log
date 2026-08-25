import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import Factory from '../../../src/Policy/Factory.mjs';

describe('TeqFw_Log_Policy_Factory', () => {
    it('creates and configures an independent policy', () => {
        const levels = Object.freeze({
            TRACE: 'trace', DEBUG: 'debug', INFO: 'info', WARN: 'warn', ERROR: 'error', FATAL: 'fatal',
        });
        let received;
        class Policy {
            /** @param {any} deps */
            constructor(deps) { assert.equal(deps.levels, levels); }
            /** @param {any} rules */
            setRules(rules) { received = rules; }
        }
        const factory = new Factory({levels, policyModule: /** @type {any} */ (Policy)});
        /** @type {Record<string, TeqFw_Log_Policy_Level>} */
        const rules = {'*': 'none'};

        const policy = factory.create(rules);

        assert.ok(policy instanceof Policy);
        assert.equal(received, rules);
    });
});
