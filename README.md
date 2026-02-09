# Git Remote Color

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/jpoehnelt.vscode-git-remote-color?logo=visual-studio-code&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=jpoehnelt.vscode-git-remote-color)
[![Open VSX Version](https://img.shields.io/open-vsx/v/jpoehnelt/vscode-git-remote-color?logo=eclipse-ide&label=Open%20VSX)](https://open-vsx.org/extension/jpoehnelt/vscode-git-remote-color)

**Automatically colors your VS Code workspace based on the git remote URL.** Every repository gets its own unique, consistent color — no manual setup required.

Inspired by [Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock), but fully automatic using a deterministic hash of your git remote.

## How It Works

1. On startup, the extension reads the git remote URL (default: `origin`)
2. The URL is normalized and hashed (FNV-1a) to produce a number
3. The number maps to a hue on the HSL color wheel
4. The resulting color is applied to your status bar (title bar and activity bar can be enabled in settings)

The same remote always produces the same color, so your workspace looks consistent across sessions and machines.

## Features

- **Zero configuration** — colors are applied automatically on workspace open
- **Deterministic** — same remote = same color, always
- **URL normalization** — `git@github.com:foo/bar.git` and `https://github.com/foo/bar.git` produce the same color
- **Per-element control** — toggle title bar, activity bar, status bar independently
- **Adjustable palette** — customize saturation and lightness
- **Manual override** — set a specific hex color to bypass auto-detection
- **Status bar indicator** — shows the current color hex at a glance

## Commands

| Command | Description |
|---------|-------------|
| `Git Remote Color: Refresh Color from Git Remote` | Re-detect the remote and apply color |
| `Git Remote Color: Reset Workspace Colors` | Remove all managed color customizations |
| `Git Remote Color: Show Current Color` | Display the current color and remote info |

## Settings

| Setting | Default |
|---------|---------|
| `gitRemoteColor.affectTitleBar` | `false` |
| `gitRemoteColor.affectActivityBar` | `false` |
| `gitRemoteColor.affectStatusBar` | `true` |
| `gitRemoteColor.saturation` | `50` |
| `gitRemoteColor.lightness` | `40` |
| `gitRemoteColor.colorOverride` | `""` |
| `gitRemoteColor.remoteName` | `"origin"` |
| `gitRemoteColor.elementAdjustments` | *(see below)* |

Default `elementAdjustments`:

```json
{ "titleBar": "none", "activityBar": "lighten", "statusBar": "none" }
```

## License

Apache License 2.0
