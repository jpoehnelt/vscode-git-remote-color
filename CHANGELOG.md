# vscode-git-remote-color

## 0.2.0

### Minor Changes

- 2cffa70: Always color title bar and activity bar. Removed `affectTitleBar` and `affectActivityBar` settings — these elements are now always colored. Use `gitRemoteColor.elementAdjustments` to lighten/darken individual elements.

### Patch Changes

- 1eebabe: Fix title bar and activity bar coloring when disabled by default. The `config.get()` fallback values incorrectly defaulted to `true`, overriding the `false` defaults declared in `package.json`.

## 0.1.6

### Patch Changes

- 9a69314: Fix color contrast using WCAG contrast ratio and default to status bar only

## 0.1.5

### Patch Changes

- Updated extension icon

## 0.1.4

### Patch Changes

- Updated extension icon with improved design

## 0.1.3

### Patch Changes

- Fix publishing to Open VSX Registry

## 0.1.2

### Patch Changes

- 559130c: Updated extension icon with transparent background

## 0.1.1

### Patch Changes

- bd7d839: Initial release
