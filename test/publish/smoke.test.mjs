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

        const {stdout: packStdout} = await run('npm', ['pack', '--json', '--pack-destination', packDir], REPO_ROOT);
        /** @type {{filename?: string, files?: {path: string}[]}[]} */
        const packed = JSON.parse(packStdout);
        const tarballName = packed.at(0)?.filename;
        assert.equal(typeof tarballName, 'string');
        const tarballPath = path.join(packDir, /** @type {string} */ (tarballName));
        const packedPaths = packed.at(0)?.files?.map((file) => file.path) ?? [];
        assert.ok(packedPaths.includes('skills/teqfw-log/SKILL.md'));
        assert.equal(packedPaths.includes('bootstrap.d.ts'), false);
        assert.equal(packedPaths.some((file) => file.startsWith('ai/')), false);

        await fs.writeFile(path.join(consumerDir, 'package.json'), JSON.stringify({
            name: 'teqfw-log-publish-smoke',
            private: true,
            type: 'module',
            dependencies: {
                '@teqfw/log': `file:${tarballPath}`,
            },
            devDependencies: {
                '@types/node': '^26.1.1',
            },
        }, null, 2));

        await run('npm', ['install'], consumerDir);

        await fs.writeFile(path.join(consumerDir, 'tsconfig.json'), JSON.stringify({
            compilerOptions: {
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                target: 'ES2022',
                strict: true,
                noEmit: true,
                checkJs: true,
            },
            include: [
                'index.ts',
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
