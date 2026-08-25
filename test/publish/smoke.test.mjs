import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {describe, it} from 'node:test';
import {promisify} from 'node:util';

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(import.meta.dirname, '../..');
const TSC_BIN = path.join(REPO_ROOT, 'node_modules', 'typescript', 'bin', 'tsc');

/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {string} cwd
 */
async function run(cmd, args, cwd) {
    return execFileAsync(cmd, args, {
        cwd,
        env: {
            ...process.env,
            npm_config_fund: 'false',
            npm_config_audit: 'false',
            npm_config_cache: path.join(os.tmpdir(), 'teqfw-log-npm-cache'),
        },
    });
}

describe('Publish smoke', () => {
    it('installs packed tarball, exposes only the DI component, and type-checks consumers', async () => {
        const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'teqfw-log-publish-'));
        const packDir = path.join(tmpRoot, 'pack');
        const consumerDir = path.join(tmpRoot, 'consumer');
        await fs.mkdir(packDir, {recursive: true});
        await fs.mkdir(consumerDir, {recursive: true});

        await run('npm', ['pack', '--json', '--pack-destination', packDir], REPO_ROOT);
        const tarballs = (await fs.readdir(packDir)).filter((entry) => entry.endsWith('.tgz'));
        assert.equal(tarballs.length, 1);
        const tarballPath = path.join(packDir, tarballs[0]);

        await fs.writeFile(path.join(consumerDir, 'package.json'), JSON.stringify({
            name: 'teqfw-log-publish-smoke',
            private: true,
            type: 'module',
            dependencies: {
                '@teqfw/log': `file:${tarballPath}`,
                '@teqfw/di': `file:${path.join(REPO_ROOT, 'node_modules', '@teqfw', 'di')}`,
            },
        }, null, 2));

        await run('npm', ['install'], consumerDir);
        await fs.access(path.join(consumerDir, 'node_modules', '@teqfw', 'log', 'skills', 'teqfw-log', 'SKILL.md'));

        await fs.writeFile(path.join(consumerDir, 'tsconfig.json'), JSON.stringify({
            compilerOptions: {
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                target: 'ES2022',
                strict: true,
                noEmit: true,
                allowJs: true,
                checkJs: false,
            },
            include: [
                'index.ts',
                'node-shim.d.ts',
                'node_modules/@teqfw/log/src',
                'node_modules/@teqfw/log/types.d.ts',
            ],
        }, null, 2));

        await fs.writeFile(path.join(consumerDir, 'index.ts'), [
            "import type {TeqFw_Log_Provider} from '@teqfw/log';",
            '',
            'declare const provider: TeqFw_Log_Provider;',
            "const logger = provider.forSource('App_User_Service');",
            "logger.info('ok');",
            '',
        ].join('\n'));
        await fs.writeFile(path.join(consumerDir, 'node-shim.d.ts'), [
            'declare const process: {',
            '  stderr?: {write?: (message: string) => void};',
            '};',
            '',
        ].join('\n'));

        await assert.rejects(
            () => run('node', ['--input-type=module', '-e', "import '@teqfw/log';"], consumerDir),
            (error) => /No "exports" main defined/.test(/** @type {Error & {stderr: string}} */ (error).stderr)
        );

        /** @type {any} */
        let privateImportError;
        await assert.rejects(
            () => run('node', ['--input-type=module', '-e', "import '@teqfw/log/src/Logger.mjs';"], consumerDir),
            (error) => {
                privateImportError = error;
                return true;
            }
        );
        assert.match(privateImportError.stderr, /Package subpath '.\/src\/Logger\.mjs' is not defined/);

        await assert.rejects(
            () => run('node', ['--input-type=module', '-e', "import '@teqfw/log/bootstrap';"], consumerDir),
            (error) => /Package subpath '.\/bootstrap' is not defined/.test(/** @type {Error & {stderr: string}} */ (error).stderr)
        );
        try {
            await run(process.execPath, [TSC_BIN, '-p', 'tsconfig.json'], consumerDir);
        } catch (error) {
            const err = /** @type {Error & {stdout?: string, stderr?: string}} */ (error);
            throw new Error(`${err.stdout}${err.stderr}`, {cause: err});
        }
    });
});
