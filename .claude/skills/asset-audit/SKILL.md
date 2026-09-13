---
name: asset-audit
description: Audit local video/image assets and create a safe mapping for A Little Journey.
---

# Asset Audit

Run this skill before implementing or changing the story media layer.

## Goals

1. Inspect `assets/v/` and `assets/i/`.
2. List actual files, formats, dimensions where practical, and sizes.
3. Never rename, copy, transcode, or modify originals.
4. Identify browser-compatible video candidates.
5. Map real files to story scenes without assuming example filenames.
6. Keep public browser URLs stable as `/assets/v/...` and `/assets/i/...`.

## Expected output

Print a concise inventory such as:

```text
Found video assets:
✓ <actual-file>

Found image assets:
✓ <actual-file>

Story mapping:
01 Morning → <actual-file>
...
```

If the number/order of files does not clearly identify scenes, make the smallest reasonable mapping and document the uncertainty rather than inventing content.
