# @teqfw/log

`@teqfw/log` is the base logging contract package for the TeqFW platform.

It provides a small, stable logging surface for TeqFW packages without coupling application code to a specific logging backend.

The package is intended for source-bound structured logging in TeqFW codebases. A package or service receives one root provider, binds it to a stable component source, and then emits records with a human-readable message plus machine-readable metadata.

## What This Package Includes

- source-bound logger contract for TeqFW packages;
- fixed log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`;
- structured records based on `message + data`;
- reserved data fields for errors and tracing;
- a reference console writer for browser and Node.js environments;
- integration with [`@teqfw/di`](https://github.com/teqfw/di) as the default dependency-injection foundation.

## What This Package Is For

- giving TeqFW packages a shared logging contract;
- binding loggers to stable component-style sources such as `App_User_Service`;
- emitting structured metadata through `data` instead of formatting everything into strings;
- keeping the logging entrypoint small enough to replace or extend the actual sink later.

## Public npm API

The published npm package exposes one public entrypoint:

```js
import TeqFw_Log_Provider from '@teqfw/log';
```

The provider is the supported root dependency for consumer code. It returns source-bound logger instances through `forSource(source)`.

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

## Design Basis

`@teqfw/log` is built on top of [`@teqfw/di`](https://github.com/teqfw/di), the dependency-injection package used by TeqFW.

The package is also developed using ADSM, Alex Gusev's approach to maintaining product and architecture context alongside implementation work. Background materials:

- ADSM book: http://fly.wiredgeese.com/flancer/leanpub/adsm-en/
- Alex Gusev: https://wiredgeese.com/

ADSM and TeqFW are original developments by Alex Gusev.

## Notes For Consumers

- The distributable package includes `ai/` documents for agent-facing usage and API guidance.
- The repository may contain additional cognitive context in `ctx/`, but that repository branch is not part of the npm package.
