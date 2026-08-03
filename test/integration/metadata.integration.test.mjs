import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {describe, it} from 'node:test';

import PackageRegistry from '@teqfw/di/node/registry/package';
import NamespaceRegistry from '@teqfw/di/node/registry/namespace';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

describe('Distributed TeqFW metadata', () => {
    it('publishes only the canonical DI namespace declaration', async () => {
        const manifest = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf8'));

        assert.deepEqual(manifest.teqfw.fw.di.namespaces, [{
            prefix: 'TeqFw_Log_', path: './src', ext: '.mjs',
        }]);
        assert.equal('namespace' in manifest.teqfw.fw.di, false);
        assert.equal('namespaces' in manifest.teqfw, false);
    });

    it('uses dependency-first postorder package records for pre-Container metadata collection', async () => {
        const packages = await new PackageRegistry({fs, path, appRoot: ROOT}).build();
        const names = packages.map((record) => record.name);
        assert.deepEqual(names, ['@teqfw/di', '@teqfw/log']);
    });

    it('discovers canonical namespace declarations for DI container configuration', async () => {
        const namespaces = await new NamespaceRegistry({fs, path, appRoot: ROOT}).build();

        assert.deepEqual(namespaces.map(({prefix, ext}) => ({prefix, ext})), [
            {prefix: 'TeqFw_Log_', ext: '.mjs'},
            {prefix: 'TeqFw_Di_', ext: '.mjs'},
        ]);
    });
});
