import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import Policy, {parsePolicyFile} from '../../src/Policy.mjs';

const levels = Object.freeze({
    TRACE: 'trace', DEBUG: 'debug', INFO: 'info', WARN: 'warn', ERROR: 'error', FATAL: 'fatal',
});

describe('TeqFw_Log_Policy', () => {
    it('uses info as the default threshold', () => {
        const policy = new Policy({levels});
        assert.equal(policy.isEnabled('App_User_Service', 'debug'), false);
        assert.equal(policy.isEnabled('App_User_Service', 'info'), true);
        assert.equal(policy.isEnabled('App_User_Service', 'fatal'), true);
    });

    it('selects the most specific matching source rule', () => {
        const policy = new Policy({levels});
        policy.setRules({'*': 'warn', 'App_Import_*': 'debug', 'App_Import_Run': 'trace'});
        assert.equal(policy.isEnabled('App_Import_Run', 'trace'), true);
        assert.equal(policy.isEnabled('App_Import_Other', 'trace'), false);
        assert.equal(policy.isEnabled('App_Import_Other', 'debug'), true);
        assert.equal(policy.isEnabled('App_Other_Service', 'info'), false);
    });

    it('changes existing and added rules atomically', () => {
        const policy = new Policy({levels});
        assert.equal(policy.isEnabled('App_Import_Run', 'debug'), false);
        policy.setRule('App_Import_*', 'debug');
        assert.equal(policy.isEnabled('App_Import_Run', 'debug'), true);
        policy.setRule('*', 'error');
        assert.equal(policy.isEnabled('App_Import_Run', 'info'), true);
    });

    it('parses valid files and rejects malformed rules and levels atomically', () => {
        const policy = new Policy({levels});
        const rules = parsePolicyFile('# runtime policy\n*=warn\nApp_Import_*=trace\n');
        policy.setRules(/** @type {Record<string, 'trace'|'debug'|'info'|'warn'|'error'|'fatal'>} */ (rules));
        assert.equal(policy.isEnabled('App_Import_Run', 'trace'), true);
        assert.throws(() => policy.setRules(/** @type {any} */ (parsePolicyFile('*=bad'))), /level is invalid/);
        assert.throws(() => parsePolicyFile('App_Import_*=debug=oops'), /malformed/);
        assert.equal(policy.isEnabled('App_Other_Service', 'info'), false);
    });

});
