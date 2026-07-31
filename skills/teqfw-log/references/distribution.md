# Distribution

## Installed Location

The package publishes the version-matched skill at `node_modules/@teqfw/log/skills/teqfw-log/`. Load `SKILL.md` as its entry point. Every required reference is below that directory and describes the installed package version.

## Host-Owned Mounting

The host project decides whether and how to make the skill discoverable. Installation performs no `postinstall` mutation, creates no links, and does not modify host agent configuration.

A host using an `.agents/skills/` catalog can mount the installed skill explicitly:

```sh
mkdir -p .agents/skills
ln -s ../../node_modules/@teqfw/log/skills/teqfw-log .agents/skills/teqfw-log
```

Preserve host-project instructions and cognitive context as the authority for application intent and architecture.
