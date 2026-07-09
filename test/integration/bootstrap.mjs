import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import TeqFw_Di_Container from '@teqfw/di';
import TeqFw_Di_Config_NamespaceRegistry from '@teqfw/di/src/Config/NamespaceRegistry.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.resolve(__dirname, '../..');

export default async function bootstrap() {
    const container = new TeqFw_Di_Container();
    const registry = new TeqFw_Di_Config_NamespaceRegistry({fs, path, appRoot: APP_ROOT});
    const namespaces = await registry.build();
    for (const entry of namespaces) {
        container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
    }
    return container;
}
