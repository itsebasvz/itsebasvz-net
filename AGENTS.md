# Repository guidance

This repository implements Sebastián Vázquez's portfolio, **Signals to Systems**.

The working rules — sources of truth and their precedence, architecture, the
non-negotiable constraints, and the truthfulness and privacy rules — live in a
single file:

**[CLAUDE.md](CLAUDE.md)**

Read it before changing product behavior or presentation, whoever or whatever
you are. It is kept here rather than duplicated because two copies of the same
rules drift, and a stale copy is worse than no copy: an earlier version of this
file named `docs/DESIGN.md` as the first source of truth, which the design
handoff has since superseded on everything visual.

## Validation

Before handing off a change:

```sh
npm run check
npm run build
```
