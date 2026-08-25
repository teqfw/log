// @ts-check

/**
 * @namespace TeqFw_Log_Policy_File
 * @description Node.js explicit policy-file loader; file discovery remains host-owned.
 */

export default class File {
    /**
     * @param {object} deps
     * @param {TeqFw_Log_Policy} deps.policy
     * @param {TeqFw_Log_Node_Fs_ReadFile} deps.readFile
     */
    constructor({policy, readFile}) {
        /** @param {string} path @returns {Promise<void>} */
        this.apply = async function (path) {
            if ((typeof path !== 'string') || (path.length === 0)) throw new Error('Log policy file path is invalid.');
            const text = await readFile(path, 'utf8');
            if (typeof text !== 'string') throw new Error('Log policy file reader must return text.');
            policy.applyText(text);
        };
        Object.freeze(this);
    }
}

export const __deps__ = Object.freeze({
    default: Object.freeze({policy: 'TeqFw_Log_Policy$', readFile: 'node:fs/promises__readFile'}),
});
