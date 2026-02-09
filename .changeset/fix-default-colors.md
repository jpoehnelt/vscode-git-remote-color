---
"vscode-git-remote-color": patch
---

Fix title bar and activity bar coloring when disabled by default. The `config.get()` fallback values incorrectly defaulted to `true`, overriding the `false` defaults declared in `package.json`.
