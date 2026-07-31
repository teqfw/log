# @teqfw/log

**A small logging contract for TeqFW applications that keeps packages independent of a logging backend.**

`@teqfw/log` gives a Tequila Framework package one stable way to emit useful records while leaving transport, storage, telemetry, and runtime policy to the host application. A package receives a provider, binds it once to its TeqFW component address, and logs a readable message with structured data.

## Why use it

Without a common contract, packages either import a concrete logger or invent incompatible local APIs:

```text
package → logging backend → runtime policy
```

`@teqfw/log` preserves the package boundary:

```text
package → logging contract → host-selected writers
```

That enables:

- a backend-neutral logging surface for TeqFW packages;
- source-bound records that identify the responsible component;
- fixed levels: `trace`, `debug`, `info`, `warn`, `error`, and `fatal`;
- structured `message + data` records, including `data.err` for caught errors;
- a browser- and Node.js-compatible console reference writer;
- composition-root control over optional custom writers and their shutdown.

## Quick start

Application components receive the provider through TeqFW DI, bind a stable source once, and reuse the returned logger:

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

## Public API

- `@teqfw/log` — the `TeqFw_Log_Provider` DI component and its public TypeScript-facing contract types.

Do not import `@teqfw/log/src/**`.

## Agent-ready package

The package ships with a version-matched Agent Skill in `skills/teqfw-log`. It explains the supported entrypoint, source binding, records, and package boundaries. Mount it into a host project when an agent needs implementation detail:

```sh
mkdir -p .agents/skills
cd .agents/skills
ln -s ../../node_modules/@teqfw/log/skills/teqfw-log
```

The package uses [`@teqfw/di`](https://www.npmjs.com/package/@teqfw/di) for composition. Its installed `teqfw-di` skill documents the DI API. Host instructions and architecture remain authoritative.

## Best fit

Use `@teqfw/log` when TeqFW modules need a durable shared logging contract but the application must retain control over logging infrastructure.

Use a full logging framework directly when an application has no need for a package-level contract or replaceable backend policy.

## Add to a project

```sh
npm install @teqfw/log
```

## Boundaries

This package is a contract layer with a reference console writer. It does not create a host application's composition root and does not provide transport registries, persistence, configuration DSLs, telemetry integration, or enterprise logging policy.

## Development and Ecosystem

This product is developed by AI agents under the direction of Alex Gusev, following the Agent-Driven Software Management (ADSM) methodology. It is built for the Tequila Framework (TeqFW) platform and contributes to its ecosystem.

- [Tequila Framework](https://teqfw.com/?teqfw-log)
- [Alex Gusev's Personal Website](https://wiredgeese.com/?teqfw-log)
- [Alex Gusev's Telegram Channel](https://t.me/alexgusev_lab_en)
- [Agent-Driven Software Management: A Practical Guide](http://fly.wiredgeese.com/flancer/leanpub/adsm-en/?teqfw-log)
