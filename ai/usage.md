# usage.md

Version: 20260709

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

## Direct Logger Usage

```js
import TeqFw_Log_Logger from '@teqfw/log/src/Logger.mjs';
import levels from '@teqfw/log/src/Enum/Level.mjs';
import createWriter from '@teqfw/log/src/Console/Writer.mjs';
import TeqFw_Log_Record_Factory from '@teqfw/log/src/Record/Factory.mjs';

const recordFactory = new TeqFw_Log_Record_Factory();
const writer = createWriter();
const log = TeqFw_Log_Logger({
    levels,
    recordFactory,
    writer,
    source: 'App_User_Service',
});

log.error('User profile loading failed', {userId, err});
```

## Required Practices

- receive `TeqFw_Log_Provider` through TeqFW DI or assembly;
- bind a stable source once with `forSource(source)`;
- use short human-readable messages;
- pass machine-readable metadata through `data`;
- use `data.err` for caught errors;
- check `isEnabled(level)` only when payload construction is expensive.

## Discouraged Practices

- creating source-bound loggers inside business methods;
- using file paths, package names, or generic labels as `source`;
- encoding metadata into message strings;
- inventing mandatory `event` names;
- logging raw secrets or full user payloads.
