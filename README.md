# Git Remote Color

**Automatically colors your VS Code workspace based on the git remote URL.** Every repository gets its own unique, consistent color — no manual setup required.

Inspired by [Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock), but fully automatic using a deterministic hash of your git remote.

## How It Works

1. On startup, the extension reads the git remote URL (default: `origin`)
2. The URL is normalized and hashed (FNV-1a) to produce a number
3. The number maps to a hue on the HSL color wheel
4. The resulting color is applied to your title bar, activity bar, and status bar

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

| Setting | Default | Description |
|---------|---------|-------------|
| `gitRemoteColor.affectTitleBar` | `true` | Color the title bar |
| `gitRemoteColor.affectActivityBar` | `true` | Color the activity bar |
| `gitRemoteColor.affectStatusBar` | `true` | Color the status bar |
| `gitRemoteColor.saturation` | `50` | Saturation percentage (10–100) |
| `gitRemoteColor.lightness` | `40` | Lightness percentage (15–60) |
| `gitRemoteColor.colorOverride` | `""` | Manual hex override (e.g. `#ff6347`) |
| `gitRemoteColor.remoteName` | `"origin"` | Git remote name to hash |
| `gitRemoteColor.elementAdjustments` | `{ titleBar: "none", activityBar: "lighten", statusBar: "none" }` | Per-element lighten/darken |

## License

MIT
