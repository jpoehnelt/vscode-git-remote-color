/**
 * Status bar item showing the current git remote color.
 */

import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem | undefined;

export function createStatusBarItem(): vscode.StatusBarItem {
  if (statusBarItem) {
    return statusBarItem;
  }
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'gitRemoteColor.showColor';
  statusBarItem.tooltip = 'Git Remote Color — click to show details';
  return statusBarItem;
}

export function updateStatusBarItem(color: string | null, remoteUrl: string | null): void {
  if (!statusBarItem) {
    return;
  }
  if (color) {
    statusBarItem.text = `$(paintcan) ${color}`;
    statusBarItem.tooltip = remoteUrl
      ? `Git Remote Color: ${color}\nRemote: ${remoteUrl}`
      : `Git Remote Color: ${color}`;
    statusBarItem.show();
  } else {
    statusBarItem.text = '$(paintcan) No remote';
    statusBarItem.tooltip = 'No git remote detected';
    statusBarItem.show();
  }
}

export function disposeStatusBarItem(): void {
  statusBarItem?.dispose();
  statusBarItem = undefined;
}
