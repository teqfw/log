import path from 'node:path';
import {fileURLToPath} from 'node:url';

import TeqFw_Di_Container from '@teqfw/di';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.resolve(__dirname, '../..');

export default async function bootstrap() {
    const container = new TeqFw_Di_Container();
    container.addNamespaceRoot('TeqFw_Log_', path.join(APP_ROOT, 'src'), '.mjs');
    container.addNamespaceRoot('TeqFw_Di_', path.join(APP_ROOT, 'node_modules/@teqfw/di/src'), '.mjs');
    return container;
}
