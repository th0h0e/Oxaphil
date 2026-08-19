---
name: motion
description: >
    Animation skill for Motion and CSS animation. Provides: animation best practices for Vue, documentation and example search, CSS spring and bounce generation, and runtime performance audits. Use when writing animations, working with Motion (motion, motion-v), animating a UI, writing CSS linear() springs, auditing performance/jank/layout thrash at runtime, searching Motion docs or examples, or upgrading between Motion versions.
argument-hint: "[subcommand or question, e.g. 'spring bounce 0.3', 'upgrade', 'how do I animate a list']"
---

# Motion

Animation for the web, done properly.

-   [Animation best practices](best-practices/index.md): "Animate this button", "Fade this layer in", "Animate this Vue component". Guidance for Vue, covering both Motion and plain CSS.
-   [Documentation and example search](codex/index.md): "What options does X have", "How does X work", "Use X to do Y", "Show me an example of X", "Make a carousel / ticker / modal".
-   [CSS spring and bounce generation](css-spring/index.md): "Generate a CSS spring with a bounce of 0.5 over 0.3s", "Make this bouncier", "Give me a bounce easing".
-   [Runtime performance audit](performance-audit/index.md): "Runtime audit of the homepage", "Grade the performance of [URL]". You may also run audits proactively and report what you find.

## Upgrading Motion

"/motion upgrade", "upgrade to Motion 12" and
similar all resolve through documentation search — there is no separate tool.

1. **Read the installed version first.** Check `package.json` for
   `motion-v` before searching. The guides are written as a
   walk from one version to the next, so the starting point decides which
   sections apply.
2. Search the codex for `upgrade` on the project's platform. Coming from GSAP, search `migrate from gsap`.
3. **Read the whole page and follow it in order. Do not summarise it.** Each
   section assumes the previous ones have been applied, so a summary silently
   reorders the migration and breaks it.

## If the Motion MCP server is unavailable

`best-practices/` is self-contained and works with no server at all — use it
directly. Search and easing generation need the server. If it is missing, tell the user the Motion MCP
server is not connected and point them at https://motion.dev/docs/ai-kit.
