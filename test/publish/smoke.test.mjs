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
    it('installs packed tarball, exposes only supported APIs, and type-checks bootstrap consumers', async () => {
        const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'teqfw-log-publish-'));
        const packDir = path.join(tmpRoot, 'pack');
        const consumerDir = path.join(tmpRoot, 'consumer');
        await fs.mkdir(packDir, {recursive: true});
        await fs.mkdir(consumerDir, {recursive: true});

        const {stdout: packStdout} = await run('npm', ['pack', '--json', '--pack-destination', packDir], REPO_ROOT);
        const packed = JSON.parse(packStdout);
        const tarballName = packed.at(0)?.filename;
        assert.equal(typeof tarballName, 'string');
        const tarballPath = path.join(packDir, tarballName);

        await fs.writeFile(path.join(consumerDir, 'package.json'), JSON.stringify({
            name: 'teqfw-log-publish-smoke',
            private: true,
            type: 'module',
            dependencies: {
                '@teqfw/log': `file:${tarballPath}`,
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
            },
        }, null, 2));

        await fs.writeFile(path.join(consumerDir, 'index.ts'), [
            "import {createBootstrap, type TeqFw_Log_Record} from '@teqfw/log/bootstrap';",
            '',
            'const bootstrap = await createBootstrap({writers: [{write(_record: TeqFw_Log_Record) {}}]});',
            "const logger = bootstrap.provider.forSource('App_User_Service');",
            "logger.info('ok');",
            'bootstrap.shutdown();',
            '',
        ].join('\n'));

        const {stdout: importStdout} = await run('node', ['--input-type=module', '-e', "import {createBootstrap} from '@teqfw/log/bootstrap'; console.log(typeof createBootstrap);"], consumerDir);
        assert.equal(importStdout.trim(), 'function');

        let privateImportError;
        await assert.rejects(
            () => run('node', ['--input-type=module', '-e', "import '@teqfw/log/src/Logger.mjs';"], consumerDir),
            (error) => {
                privateImportError = error;
                return true;
            }
        );
        assert.match(privateImportError.stderr, /Package subpath '.\/src\/Logger\.mjs' is not defined/);

        try {
            await run(process.execPath, [TSC_BIN, '-p', 'tsconfig.json'], consumerDir);
        } catch (error) {
            throw new Error(`${error.stdout}${error.stderr}`, {cause: error});
        }
    });
});
