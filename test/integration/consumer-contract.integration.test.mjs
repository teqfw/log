import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import bootstrap from './bootstrap.mjs';

describe('Consumer contract', () => {
    it('discovers the namespace, resolves the DI provider, and keeps the package root runtime-private', async () => {
        const container = await bootstrap();
        const provider = await container.get('TeqFw_Log_Provider$');
        const logger = provider.forSource('App_User_Service');

        assert.equal(typeof logger.info, 'function');
        await assert.rejects(() => import('@teqfw/log'), /No "exports" main defined/);
    });
});
