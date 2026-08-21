# MotionScore performance audit

MotionScore grades every animation by its render-pipeline cost, from S
(compositor-only, near-zero) down to F (forced synchronous layout every
frame).

## Runtime audits

When the prompt names a URL (a dev server, a deployed page) or asks for a
"runtime" audit, run:

```
npx motionscore <url> --agent
```
