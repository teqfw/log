// @ts-check

/**
 * @namespace TeqFw_Log_Policy
 * @description Mutable source-and-level filtering policy owned by @teqfw/log.
 */

const SOURCE = /^[A-Z][A-Za-z0-9]*(?:_[A-Z][A-Za-z0-9]*)+$/;
const PREFIX = /^[A-Z][A-Za-z0-9]*(?:_[A-Z][A-Za-z0-9]*)+_\*$/;
const NONE = 'none';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
    return (value !== null) && (typeof value === 'object') && !Array.isArray(value);
}

/**
 * Parses the compact log-owned policy-file format.
 * @param {string} text
 * @returns {Record<string, string>}
 */
export function parsePolicyFile(text) {
    if (typeof text !== 'string') throw new Error('Log policy file must be text.');
    /** @type {Record<string, string>} */
    const rules = {};
    for (const [offset, input] of text.split(/\r?\n/).entries()) {
        const line = input.trim();
        if ((line === '') || line.startsWith('#')) continue;
        const match = /^([^=\s]+)\s*=\s*([^=\s#]+)$/.exec(line);
        if (!match) throw new Error(`Log policy rule at line ${offset + 1} is malformed.`);
        const [, pattern, level] = match;
        if (Object.hasOwn(rules, pattern)) throw new Error(`Log policy rule at line ${offset + 1} duplicates '${pattern}'.`);
        rules[pattern] = level;
    }
    return rules;
}

export default class Policy {
    /**
     * @param {object} deps
     * @param {TeqFw_Log_Enum_Level} deps.levels
     */
    constructor({levels}) {
        const values = Object.values(levels);
        /** @type {ReadonlyMap<string, number>} */
        const ranks = new Map(values.map((level, index) => [level, index]));
        /** @type {ReadonlyArray<Readonly<{pattern: string, level: TeqFw_Log_Policy_Level, specificity: number}>>} */
        let active = [];
        /**
         * @param {unknown} pattern
         * @param {unknown} level
         * @returns {TeqFw_Log_Policy_Rule}
         */
        const rule = (pattern, level) => {
            if ((typeof pattern !== 'string') || !((pattern === '*') || SOURCE.test(pattern) || PREFIX.test(pattern))) {
                throw new Error(`Log policy source pattern is invalid: '${String(pattern)}'.`);
            }
            if ((typeof level !== 'string') || ((level !== NONE) && !ranks.has(level))) throw new Error(`Log policy level is invalid: '${String(level)}'.`);
            return Object.freeze({pattern, level: /** @type {TeqFw_Log_Policy_Level} */ (level), specificity: pattern === '*' ? 0 : pattern.endsWith('*') ? pattern.length - 1 : pattern.length});
        };
        /**
         * @param {unknown} input
         * @returns {TeqFw_Log_Policy_Rules}
         */
        const compile = (input) => {
            if (!isRecord(input)) throw new Error('Log policy rules must be an object.');
            const entries = Object.entries(input);
            if (entries.length === 0) throw new Error('Log policy requires at least one rule.');
            const compiled = entries.map(([pattern, level]) => rule(pattern, level));
            if (!compiled.some(({pattern}) => pattern === '*')) throw new Error("Log policy requires a '*' default rule.");
            return Object.freeze(compiled.sort((left, right) => right.specificity - left.specificity));
        };
        /** @param {Record<string, TeqFw_Log_Policy_Level>} nextRules */
        this.setRules = function (nextRules) { active = compile(nextRules); };
        /**
         * Validates and applies policy-file text atomically.
         * @param {string} text
         * @returns {void}
         */
        this.applyText = function (text) {
            this.setRules(/** @type {Record<string, TeqFw_Log_Policy_Level>} */ (parsePolicyFile(text)));
        };
        /** @param {string} pattern @param {TeqFw_Log_Policy_Level} level */
        this.setRule = function (pattern, level) {
            const next = Object.fromEntries(active.map((item) => [item.pattern, item.level]));
            next[pattern] = level;
            this.setRules(next);
        };
        /** @param {string} source @param {TeqFw_Log_Level} level @returns {boolean} */
        this.isEnabled = function (source, level) {
            if ((typeof source !== 'string') || !SOURCE.test(source)) throw new Error(`Log source is invalid: '${String(source)}'.`);
            const rank = ranks.get(level);
            if (rank === undefined) throw new Error(`Log level is invalid: '${String(level)}'.`);
            const selected = active.find(({pattern}) => (pattern === '*') || (pattern.endsWith('*') ? source.startsWith(pattern.slice(0, -1)) : source === pattern));
            if (selected?.level === NONE) return false;
            return rank >= /** @type {number} */ (ranks.get(/** @type {TeqFw_Log_Level} */ (selected?.level)));
        };
        /** @returns {Readonly<Record<string, TeqFw_Log_Policy_Level>>} */
        this.getRules = function () { return Object.freeze(Object.fromEntries(active.map(({pattern, level}) => [pattern, level]))); };
        this.setRules({'*': 'info'});
        Object.freeze(this);
    }
}

export const __deps__ = Object.freeze({
    default: Object.freeze({levels: 'TeqFw_Log_Enum_Level__default'}),
});
