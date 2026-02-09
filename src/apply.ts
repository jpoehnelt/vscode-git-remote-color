/**
 * Apply or reset workspace color customizations.
 */

import * as vscode from 'vscode';
import { adjustColor, getContrastForeground } from './color';

export interface ElementAdjustments {
  titleBar: 'none' | 'lighten' | 'darken';
  activityBar: 'none' | 'lighten' | 'darken';
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
const MANAGED_KEYS = [
  'titleBar.activeBackground',
  'titleBar.activeForeground',
  'titleBar.inactiveBackground',
  'titleBar.inactiveForeground',
  'activityBar.background',
  'activityBar.foreground',
  'statusBar.background',
  'statusBar.foreground',
  'sash.hoverBorder',
];

/**
 * Apply color customizations to the workspace settings.
 */
export async function applyColors(baseColor: string): Promise<void> {
  const config = vscode.workspace.getConfiguration('gitRemoteColor');
  const affectTitleBar = config.get<boolean>('affectTitleBar', false);
  const affectActivityBar = config.get<boolean>('affectActivityBar', false);
  const affectStatusBar = config.get<boolean>('affectStatusBar', true);
  const adjustments = config.get<ElementAdjustments>('elementAdjustments', {
    titleBar: 'none',
    activityBar: 'lighten',
    statusBar: 'none',
  });

  const wsConfig = vscode.workspace.getConfiguration('workbench');
  const existing = wsConfig.get<Record<string, string>>('colorCustomizations') || {};

  // Start with existing customizations but remove our managed keys to avoid stale values
  const colors: Record<string, string> = { ...existing };
  for (const key of MANAGED_KEYS) {
    delete colors[key];
  }

  if (affectTitleBar) {
    const bg = applyAdjustment(baseColor, adjustments.titleBar);
    const fg = getContrastForeground(bg);
    const inactiveBg = adjustColor(bg, -10);
    colors['titleBar.activeBackground'] = bg;
    colors['titleBar.activeForeground'] = fg;
    colors['titleBar.inactiveBackground'] = inactiveBg;
    colors['titleBar.inactiveForeground'] = fg;
  }

  if (affectActivityBar) {
    const bg = applyAdjustment(baseColor, adjustments.activityBar);
    const fg = getContrastForeground(bg);
    colors['activityBar.background'] = bg;
    colors['activityBar.foreground'] = fg;
  }

  if (affectStatusBar) {
    const bg = applyAdjustment(baseColor, adjustments.statusBar);
    const fg = getContrastForeground(bg);
    colors['statusBar.background'] = bg;
    colors['statusBar.foreground'] = fg;
  }

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
