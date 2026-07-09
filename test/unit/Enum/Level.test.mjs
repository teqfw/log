import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import TeqFw_Log_Enum_Level from '../../../src/Enum/Level.mjs';

describe('TeqFw_Log_Enum_Level', () => {
    it('contains all fixed levels', () => {
        assert.deepEqual(
            Object.values(TeqFw_Log_Enum_Level),
            ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
        );
    });

    it('is immutable', () => {
        assert.equal(Object.isFrozen(TeqFw_Log_Enum_Level), true);
    });
});
