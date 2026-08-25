# usage.md

Version: 20260825

## Host Composition Root

The host application configures its Container and supplies logging policy. Do not construct a provider by importing `src/**` modules, and do not treat this package as a host bootstrap library.

## Canonical DI Usage

```js
export default function Service({logger}) {
    const log = logger.forSource('App_User_Service');

    return {
        async load(userId) {
            log.info('User profile loaded', {userId});
        },
    };
}

export const __deps__ = {
    default: {
        logger: 'TeqFw_Log_Provider$',
    },
};
```

## Required Practices

- receive `TeqFw_Log_Provider` through TeqFW DI or assembly;
- bind a stable source once with `forSource(source)`;
- use short human-readable messages;
- pass machine-readable metadata through `data`;
- use `data.err` for caught errors;
- check `isEnabled(level)` only when payload construction is expensive.

## Configure Policy At Runtime

Inject the shared `TeqFw_Log_Policy$` only into a host configuration component. Each Provider shares that Policy with its bound loggers, so changes take effect immediately for existing loggers.

```js
export default function LogPolicyConfig({policy}) {
    return {
        configure() {
            policy.setRules({
                '*': 'info',
                'TeqFw_Db_*': 'debug',
                'App_Import_*': 'trace',
            });

            policy.setRule('App_Import_Run', 'debug');
        },
    };
}

export const __deps__ = {
    default: {
        policy: 'TeqFw_Log_Policy$',
    },
};
```

`setRules(rules)` atomically replaces all rules. Its input must be a non-empty object containing the `*` default rule. Each pattern is either `*`, an exact TeqFW source, or a source-prefix ending in one `*`; each value is one of the fixed log levels or `none`. `setRule(pattern, level)` updates one rule and retains the rest.

Policy log levels are thresholds: a `debug` rule enables `debug`, `info`, `warn`, `error`, and `fatal`. `none` is not a log level; it disables every log level for its matching source. Set `{'*': 'none'}` to disable logging entirely, then add a more specific rule to re-enable a source. The longest literal matching pattern wins.

For policy text already loaded by the host, call `policy.applyText(text)`. The grammar is one `pattern=level` rule per line; blank lines and lines beginning with `#` are ignored. Syntax errors, duplicate patterns, missing defaults, invalid patterns, and invalid levels leave the active rules unchanged.

For an explicit Node.js file, inject `TeqFw_Log_Policy_File$` into a Node-only host component and call `await apply(path)`. The component reads UTF-8 text and applies the same grammar. It never discovers paths itself:

```js
export default function NodeLogPolicyLoader({policyFile}) {
    return {
        async apply() {
            await policyFile.apply('/etc/my-app/log.policy');
        },
    };
}

export const __deps__ = {
    default: {
        policyFile: 'TeqFw_Log_Policy_File$',
    },
};
```

Inject `TeqFw_Log_Policy_Factory$` into a host component and call `create({'*': 'info', 'App_Import_*': 'trace'})` only when an independent Policy instance is needed. It does not automatically replace the shared Policy used by an existing Provider; host composition decides where the independent instance belongs.

## Discouraged Practices

- creating source-bound loggers inside business methods;
- depending on package-internal files through undocumented subpath imports;
- constructing `Logger`, `Level`, a record factory, or a writer from `src/**`;
- using file paths, package names, or generic labels as `source`;
- encoding metadata into message strings;
- inventing mandatory `event` names;
- logging raw secrets or full user payloads.
