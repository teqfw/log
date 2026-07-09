import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import bootstrap from './bootstrap.mjs';

describe('Integration: TeqFw_Log_Provider', () => {
    it('resolves through DI and binds logger to source', async () => {
        const container = await bootstrap();
        const provider = await container.get('TeqFw_Log_Provider$');
        const logger = provider.forSource('App_User_Service');

        assert.equal(typeof provider.forSource, 'function');
        assert.equal(typeof logger.info, 'function');
        assert.equal(logger, provider.forSource('App_User_Service'));
    });

    it('builds namespace registry for own package and @teqfw/di', async () => {
        const container = await bootstrap();
        const provider = await container.get('TeqFw_Log_Provider$');
        const logger = provider.forSource('TeqFw_Log_Provider');

        assert.equal(typeof logger.isEnabled, 'function');
        assert.equal(logger.isEnabled('info'), true);
    });
});
