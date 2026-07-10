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
    it('installs packed tarball, imports root entrypoint, and type-checks consumer code', async () => {
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
            "import TeqFw_Log_Provider from '@teqfw/log';",
            '',
            'const provider = new TeqFw_Log_Provider({',
            "  levels: {default: {TRACE: 'trace', DEBUG: 'debug', INFO: 'info', WARN: 'warn', ERROR: 'error', FATAL: 'fatal'}},",
            '  loggerModule: class {',
            "    source = 'App_User_Service';",
            '    constructor() {}',
            '    isEnabled(_level: TeqFw_Log_Level) { return true; }',
            '    write(_record: TeqFw_Log_Record) {}',
            '    log(_level: TeqFw_Log_Level, _message: string, _data?: TeqFw_Log_Data) {}',
            '    trace(_message: string, _data?: TeqFw_Log_Data) {}',
            '    debug(_message: string, _data?: TeqFw_Log_Data) {}',
            '    info(_message: string, _data?: TeqFw_Log_Data) {}',
            '    warn(_message: string, _data?: TeqFw_Log_Data) {}',
            '    error(_message: string, _data?: TeqFw_Log_Data) {}',
            '    fatal(_message: string, _data?: TeqFw_Log_Data) {}',
            '  },',
            '  recordFactory: {create(record: any) { return record; }},',
            '  writer: {write() {}},',
            '});',
            "const logger = provider.forSource('App_User_Service');",
            "logger.info('ok');",
            '',
        ].join('\n'));

        const {stdout: importStdout} = await run('node', ['--input-type=module', '-e', "import TeqFw_Log_Provider from '@teqfw/log'; console.log(typeof TeqFw_Log_Provider);"], consumerDir);
        assert.equal(importStdout.trim(), 'function');

        await run(process.execPath, [TSC_BIN, '-p', 'tsconfig.json'], consumerDir);
    });
});
