/**
 * Color utilities for the Git Remote Color extension.
 *
 * Provides deterministic hashing, HSL→Hex conversion, contrast
 * calculation, and lighten/darken adjustments.
 */

/**
 * FNV-1a 32-bit hash. Fast, well-distributed, deterministic.
 */
export function hashString(str: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0; // FNV prime, keep as uint32
  }
  return hash >>> 0;
}

/**
 * Map a hash to a color using HSL color space.
 * Hue is distributed across [0, 360), saturation and lightness are configurable.
 */
export function hashToHex(hash: number, saturation: number, lightness: number): string {
  const hue = hash % 360;
  return hslToHex(hue, saturation, lightness);
}

/**
 * Convert HSL values to a hex color string.
 * h: [0, 360), s: [0, 100], l: [0, 100]
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Parse a hex color to RGB components.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/**
 * Calculate relative luminance per WCAG 2.0.
 */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Return a light or dark foreground color based on background contrast.
 */
export function getContrastForeground(
  backgroundHex: string,
  lightFg: string = '#e7e7e7',
  darkFg: string = '#15202b'
): string {
  const lum = relativeLuminance(backgroundHex);
  // Use light foreground on dark backgrounds (luminance < 0.179)
  return lum < 0.179 ? lightFg : darkFg;
}

/**
 * Lighten or darken a hex color by a percentage amount.
 * Positive = lighten, negative = darken.
 */
export function adjustColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);

  const adjust = (c: number) => {
    if (amount > 0) {
      // Lighten: blend toward white
      return Math.round(c + (255 - c) * (amount / 100));
    } else {
      // Darken: blend toward black
      return Math.round(c * (1 + amount / 100));
    }
  };

  const clamp = (n: number) => Math.max(0, Math.min(255, n));
  const toHex = (n: number) => {
    const h = clamp(n).toString(16);
    return h.length === 1 ? '0' + h : h;
  };

  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
}

/**
 * Normalize a git remote URL to a canonical form so that equivalent
 * URLs produce the same hash.
 *
 * Strips protocol, trailing .git, trailing slashes, and lowercases.
 * git@github.com:foo/bar.git → github.com/foo/bar
 * https://github.com/foo/bar.git → github.com/foo/bar
 */
export function normalizeRemoteUrl(url: string): string {
  let normalized = url.trim().toLowerCase();

  // SSH format: git@host:path → host/path
  const sshMatch = normalized.match(/^[\w-]+@([^:]+):(.+)$/);
  if (sshMatch) {
    normalized = `${sshMatch[1]}/${sshMatch[2]}`;
  }

  // Strip protocols
  normalized = normalized.replace(/^(https?:\/\/|git:\/\/|ssh:\/\/)/, '');

  // Strip authentication (user@, user:pass@)
  normalized = normalized.replace(/^[^@]+@/, '');

  // Strip trailing .git
  normalized = normalized.replace(/\.git$/, '');

  // Strip trailing slashes
  normalized = normalized.replace(/\/+$/, '');

  return normalized;
}
