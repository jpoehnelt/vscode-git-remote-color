/**
 * Apply or reset workspace color customizations.
 */

import * as vscode from 'vscode';
import { adjustColor, getContrastForeground } from './color';

export interface ElementAdjustments {
  statusBar: 'none' | 'lighten' | 'darken';
}

const ADJUSTMENT_AMOUNT = 15; // percent

function applyAdjustment(hex: string, adjustment: 'none' | 'lighten' | 'darken'): string {
  switch (adjustment) {
    case 'lighten':
      return adjustColor(hex, ADJUSTMENT_AMOUNT);
    case 'darken':
      return adjustColor(hex, -ADJUSTMENT_AMOUNT);
    default:
      return hex;
  }
}

// All the color keys we manage, so we can cleanly remove them
const MANAGED_KEYS = ['statusBar.background', 'statusBar.foreground', 'sash.hoverBorder'];

/**
 * Apply color customizations to the workspace settings.
 */
export async function applyColors(baseColor: string): Promise<void> {
  const config = vscode.workspace.getConfiguration('gitRemoteColor');

  const defaultAdjustments: ElementAdjustments = {
    statusBar: 'none',
  };

  const userAdjustments = config.get<ElementAdjustments>('elementAdjustments');
  const adjustments = { ...defaultAdjustments, ...userAdjustments };

  const wsConfig = vscode.workspace.getConfiguration('workbench');
  const existing = wsConfig.get<Record<string, string>>('colorCustomizations') || {};

  // Start with existing customizations but remove our managed keys to avoid stale values
  const colors: Record<string, string> = { ...existing };
  for (const key of MANAGED_KEYS) {
    delete colors[key];
  }

  const bg = applyAdjustment(baseColor, adjustments.statusBar);
  const fg = getContrastForeground(bg);
  colors['statusBar.background'] = bg;
  colors['statusBar.foreground'] = fg;

  // Sash hover border uses the base color for a subtle accent
  colors['sash.hoverBorder'] = baseColor;

  await wsConfig.update('colorCustomizations', colors, vscode.ConfigurationTarget.Workspace);
}

/**
 * Remove all managed color customizations from workspace settings.
 */
export async function resetColors(): Promise<void> {
  const wsConfig = vscode.workspace.getConfiguration('workbench');
  const existing = wsConfig.get<Record<string, string>>('colorCustomizations') || {};

  const colors: Record<string, string> = { ...existing };
  for (const key of MANAGED_KEYS) {
    delete colors[key];
  }

  // If nothing remains, remove the key entirely
  const value = Object.keys(colors).length > 0 ? colors : undefined;
  await wsConfig.update('colorCustomizations', value, vscode.ConfigurationTarget.Workspace);
}
