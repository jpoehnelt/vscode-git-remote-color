/**
 * Git Remote Color — VS Code Extension
 *
 * Automatically colors your workspace based on a hash of the git remote URL.
 * Every repository gets its own unique, consistent color.
 */

import * as vscode from 'vscode';
import { applyColors, resetColors } from './apply';
import { hashString, hashToHex, normalizeRemoteUrl } from './color';
import { getGitRemoteUrl } from './git';
import { createStatusBarItem, disposeStatusBarItem, updateStatusBarItem } from './statusbar';

let currentColor: string | null = null;
let currentRemoteUrl: string | null = null;

/**
 * Detect the git remote and apply the corresponding color.
 */
async function refreshColor(): Promise<void> {
  const config = vscode.workspace.getConfiguration('gitRemoteColor');

  // Check for manual override first
  const override = config.get<string>('colorOverride', '');
  if (override && /^#[0-9a-fA-F]{6}$/.test(override)) {
    currentColor = override;
    currentRemoteUrl = null;
    await applyColors(override);
    updateStatusBarItem(override, null);
    return;
  }

  // Get the first workspace folder
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    currentColor = null;
    currentRemoteUrl = null;
    updateStatusBarItem(null, null);
    return;
  }

  const remoteName = config.get<string>('remoteName', 'origin');
  const folderPath = folders[0].uri.fsPath;
  const remoteUrl = await getGitRemoteUrl(folderPath, remoteName);

  if (!remoteUrl) {
    currentColor = null;
    currentRemoteUrl = null;
    updateStatusBarItem(null, null);
    return;
  }

  const normalized = normalizeRemoteUrl(remoteUrl);
  const hash = hashString(normalized);

  const saturation = config.get<number>('saturation', 50);
  const lightness = config.get<number>('lightness', 40);
  const color = hashToHex(hash, saturation, lightness);

  currentColor = color;
  currentRemoteUrl = remoteUrl;

  await applyColors(color);
  updateStatusBarItem(color, remoteUrl);
}

export function activate(context: vscode.ExtensionContext): void {
  // Create status bar item
  const statusBar = createStatusBarItem();
  context.subscriptions.push(statusBar);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('gitRemoteColor.refresh', async () => {
      await refreshColor();
      vscode.window.showInformationMessage(
        currentColor
          ? `Git Remote Color: Applied ${currentColor}`
          : 'Git Remote Color: No git remote found',
      );
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('gitRemoteColor.reset', async () => {
      await resetColors();
      currentColor = null;
      currentRemoteUrl = null;
      updateStatusBarItem(null, null);
      vscode.window.showInformationMessage('Git Remote Color: Workspace colors reset');
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('gitRemoteColor.showColor', () => {
      if (currentColor) {
        const remoteInfo = currentRemoteUrl ? `\nRemote: ${currentRemoteUrl}` : '';
        vscode.window.showInformationMessage(`Git Remote Color: ${currentColor}${remoteInfo}`);
      } else {
        vscode.window.showInformationMessage('Git Remote Color: No color currently applied');
      }
    }),
  );

  // Re-apply when workspace folders change
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      refreshColor();
    }),
  );

  // Re-apply when configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('gitRemoteColor')) {
        refreshColor();
      }
    }),
  );

  // Apply on activation
  refreshColor();
}

export function deactivate(): void {
  disposeStatusBarItem();
}
