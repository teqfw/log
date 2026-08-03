import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import TeqFw_Di_Container from '@teqfw/di';
import TeqFw_Di_Node_Registry_Namespace from '@teqfw/di/node/registry/namespace';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.resolve(__dirname, '../..');

export default async function bootstrap() {
    const container = new TeqFw_Di_Container();
    const namespaces = await new TeqFw_Di_Node_Registry_Namespace({fs, path, appRoot: APP_ROOT}).build();
    for (const {prefix, dirAbs, ext} of namespaces) {
        container.addNamespaceRoot(prefix, dirAbs, ext);
    }
    return container;
}
