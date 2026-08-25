import assert from 'node:assert/strict';
import {mkdtemp, rm, writeFile, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, it} from 'node:test';

import Levels from '../../src/Enum/Level.mjs';
import Policy, {parsePolicyFile} from '../../src/Policy.mjs';
import PolicyFile from '../../src/Policy/File.mjs';
import PolicyFactory from '../../src/Policy/Factory.mjs';
import Logger from '../../src/Logger.mjs';
import RecordFactory from '../../src/Record/Factory.mjs';

describe('TeqFw_Log_Policy', () => {
    it('uses info as the default threshold', () => {
        const policy = new Policy({levels: Levels});
        assert.equal(policy.isEnabled('App_User_Service', 'debug'), false);
        assert.equal(policy.isEnabled('App_User_Service', 'info'), true);
        assert.equal(policy.isEnabled('App_User_Service', 'fatal'), true);
    });

    it('creates an independent policy from programmatic rules', () => {
        const factory = new PolicyFactory({levels: Levels, policyModule: Policy});
        const policy = factory.create({'*': 'error', 'App_Import_*': 'trace'});
        assert.equal(policy.isEnabled('App_Import_Run', 'debug'), true);
        assert.equal(policy.isEnabled('App_User_Service', 'warn'), false);
    });

    it('selects the most specific matching source rule', () => {
        const policy = new Policy({levels: Levels});
        policy.setRules({'*': 'warn', 'App_Import_*': 'debug', 'App_Import_Run': 'trace'});
        assert.equal(policy.isEnabled('App_Import_Run', 'trace'), true);
        assert.equal(policy.isEnabled('App_Import_Other', 'trace'), false);
        assert.equal(policy.isEnabled('App_Import_Other', 'debug'), true);
        assert.equal(policy.isEnabled('App_Other_Service', 'info'), false);
    });

    it('changes existing and added rules without recreating loggers', () => {
        const policy = new Policy({levels: Levels});
        /** @type {TeqFw_Log_Record[]} */
        const calls = [];
        const logger = new Logger({levels: Levels, policy, recordFactory: new RecordFactory(), writer: {write: (record) => calls.push(record)}, source: 'App_Import_Run'});
        assert.equal(logger.isEnabled('debug'), false);
        logger.debug('discarded');
        policy.setRule('App_Import_*', 'debug');
        assert.equal(logger.isEnabled('debug'), true);
        logger.debug('written');
        policy.setRule('*', 'error');
        assert.equal(logger.isEnabled('info'), true);
        assert.deepEqual(calls.map((record) => record.message), ['written']);
    });

    it('parses valid files and rejects malformed rules and levels atomically', () => {
        const policy = new Policy({levels: Levels});
        const rules = parsePolicyFile('# runtime policy\n*=warn\nApp_Import_*=trace\n');
        policy.setRules(/** @type {Record<string, import('../../src/Enum/Level.mjs').default[keyof import('../../src/Enum/Level.mjs').default]>} */ (rules));
        assert.equal(policy.isEnabled('App_Import_Run', 'trace'), true);
        assert.throws(() => policy.setRules(/** @type {any} */ (parsePolicyFile('*=bad'))), /level is invalid/);
        assert.throws(() => parsePolicyFile('App_Import_*=debug=oops'), /malformed/);
        assert.equal(policy.isEnabled('App_Other_Service', 'info'), false);
    });

    it('applies and reloads explicitly supplied policy files', async () => {
        const directory = await mkdtemp(join(tmpdir(), 'teqfw-log-'));
        const path = join(directory, 'log.policy');
        const policy = new Policy({levels: Levels});
        const file = new PolicyFile({policy, readFile: (path) => readFile(path, 'utf8')});
        try {
            await writeFile(path, '*=error\nApp_Import_*=debug\n');
            await file.apply(path);
            assert.equal(policy.isEnabled('App_Import_Run', 'debug'), true);
            await writeFile(path, '*=fatal\n');
            await file.apply(path);
            assert.equal(policy.isEnabled('App_Import_Run', 'error'), false);
        } finally {
            await rm(directory, {recursive: true, force: true});
        }
    });
});
