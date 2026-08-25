// @ts-check

/**
 * @namespace TeqFw_Log_Policy_Factory
 * @description Creates independent mutable Policies from programmatic rule records.
 */

export default class Factory {
    /**
     * @param {object} deps
     * @param {TeqFw_Log_Enum_Level} deps.levels
     * @param {TeqFw_Log_Policy__Class} deps.policyModule
     */
    constructor({levels, policyModule}) {
        /**
         * @param {Record<string, TeqFw_Log_Policy_Level>} rules
         * @returns {TeqFw_Log_Policy}
         */
        this.create = function (rules) {
            const policy = new policyModule({levels});
            policy.setRules(rules);
            return policy;
        };
        Object.freeze(this);
    }
}

export const __deps__ = Object.freeze({
    levels: 'TeqFw_Log_Enum_Level__default',
    policyModule: 'TeqFw_Log_Policy__default',
});
