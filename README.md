# @teqfw/log

![npms.io](https://img.shields.io/npm/dm/@teqfw/log)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@teqfw/log)

> **Human-governed. Agent-built. Agent-ready.**

`@teqfw/log` gives TeqFW packages one stable way to emit useful log records without coupling to a concrete logging backend. It is a foundational package of the Tequila Framework ([TeqFW](https://teqfw.com/)): created and evolved by coding agents under the architectural direction and final responsibility of [Alex Gusev](https://github.com/flancer64), and shipped with a version-matched Agent Skill so other agents can understand, integrate, and use it correctly.

## Why use it

> **A logging contract lets packages log without binding the application to a logging backend.**

Without a common contract, packages either import a concrete logger or invent incompatible local APIs, coupling message emission to a specific runtime policy:

```text
package → logging backend → runtime policy
```

`@teqfw/log` keeps the package boundary intact:

```text
package → logging contract → host-selected writers
```

That enables:

- a backend-neutral logging surface for TeqFW packages;
- source-bound records that identify the responsible component;
- fixed levels: `trace`, `debug`, `info`, `warn`, `error`, and `fatal`;
- structured `message + data` records, including `data.err` for caught errors;
- a browser- and Node.js-compatible console reference writer;
- a shared mutable policy with `*=info` as the out-of-box threshold;
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

## Runtime logging policy

Every provider shares one `TeqFw_Log_Policy$`. The default `*=info` writes `info` and more severe events to the built-in console writer. A policy rule is an exact source or a trailing namespace prefix; the longest match wins:

```text
*=info
TeqFw_Db_*=debug
App_Import_*=trace
```

Use `TeqFw_Log_Policy_Factory$` to create a policy from programmatic rules, or the shared DI Policy component to replace or change live rules; loggers that already exist see the update immediately. `Logger.isEnabled(level)` and actual output consult the same policy. `TeqFw_Log_Policy_File$` explicitly applies a file with the format above; blank lines and `#` comments are allowed. Invalid syntax, patterns, or levels fail without changing the active policy. log itself never searches for configuration files.

## Agent-ready package

The package ships with three aligned interfaces:

- runtime code in `src`;
- type information through JSDoc and `types.d.ts`;
- a version-matched Agent Skill in `skills/teqfw-log`.

The skill explains the logging contract, source binding, records, and package boundaries. An agent does not need to reconstruct the package architecture from source code alone.

The package uses [`@teqfw/di`](https://www.npmjs.com/package/@teqfw/di) for composition. Project instructions and application architecture remain authoritative over package-level guidance.

## Best fit

Use `@teqfw/log` when TeqFW modules need a durable shared logging contract but the application must retain control over logging infrastructure.

Use a full logging framework directly when an application has no need for a package-level contract or replaceable backend policy.

## Add to a project

```sh
npm install @teqfw/log
```

## Boundaries

This package is a contract layer with a reference console writer. It does not create a host application's composition root and does not provide transport registries, persistence, configuration DSLs, telemetry integration, or enterprise logging policy.

## Agent-Driven Development

TeqFW is built through the same development model that it is designed to enable: one human defines the intent, architecture, constraints, and acceptance criteria; coding agents implement and maintain the products; other agents use those products in different combinations to create applications.

`@teqfw/log` is a foundational package of TeqFW. The package includes a version-matched Agent Skill in `skills/teqfw-log`. The README provides a human-facing product overview; the skill provides agents with the package concepts, contracts, integration rules, examples, and boundaries.

Mount the skill into a host project:

```sh
mkdir -p .agents/skills
ln -s ../../node_modules/@teqfw/log/skills/teqfw-log \
  .agents/skills/teqfw-log
```

Each TeqFW package is both a practical software component and a working demonstration of human-governed, agent-driven development. This work follows the Agent-Driven Software Management (ADSM) approach: human intent, architectural authority, acceptance, and responsibility remain authoritative; agents act as implementation and reasoning partners.

- [Tequila Framework](https://teqfw.com/?from=github-teqfw-log)
- [Agent-Driven Software Management: A Practical Guide](http://fly.wiredgeese.com/flancer/leanpub/adsm-en/?from=github-teqfw-log)
- [Alex Gusev](https://github.com/flancer64)
