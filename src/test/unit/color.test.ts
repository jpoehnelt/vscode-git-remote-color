/**
 * Unit tests for color utilities.
 * Run with: npx mocha out/test/unit/color.test.js
 */

import * as assert from 'assert';
import {
  hashString,
  hashToHex,
  hslToHex,
  hexToRgb,
  relativeLuminance,
  getContrastForeground,
  adjustColor,
  normalizeRemoteUrl,
} from '../../color';

suite('Color Utilities', () => {
  suite('hashString', () => {
    test('is deterministic', () => {
      const a = hashString('hello');
      const b = hashString('hello');
      assert.strictEqual(a, b);
    });

    test('different inputs produce different hashes', () => {
      const a = hashString('github.com/foo/bar');
      const b = hashString('github.com/baz/qux');
      assert.notStrictEqual(a, b);
    });

    test('returns a positive 32-bit integer', () => {
      const h = hashString('test');
      assert.ok(h >= 0);
      assert.ok(h <= 0xFFFFFFFF);
    });
  });

  suite('hashToHex', () => {
    test('returns a valid hex color', () => {
      const color = hashToHex(hashString('test'), 50, 40);
      assert.match(color, /^#[0-9a-f]{6}$/);
    });

    test('same input produces same color', () => {
      const hash = hashString('github.com/foo/bar');
      const a = hashToHex(hash, 50, 40);
      const b = hashToHex(hash, 50, 40);
      assert.strictEqual(a, b);
    });
  });

  suite('hslToHex', () => {
    test('red', () => {
      assert.strictEqual(hslToHex(0, 100, 50), '#ff0000');
    });

    test('green', () => {
      assert.strictEqual(hslToHex(120, 100, 50), '#00ff00');
    });

    test('blue', () => {
      assert.strictEqual(hslToHex(240, 100, 50), '#0000ff');
    });

    test('white', () => {
      assert.strictEqual(hslToHex(0, 0, 100), '#ffffff');
    });

    test('black', () => {
      assert.strictEqual(hslToHex(0, 0, 0), '#000000');
    });
  });

  suite('hexToRgb', () => {
    test('parses white', () => {
      const { r, g, b } = hexToRgb('#ffffff');
      assert.strictEqual(r, 255);
      assert.strictEqual(g, 255);
      assert.strictEqual(b, 255);
    });

    test('parses without hash', () => {
      const { r, g, b } = hexToRgb('ff0000');
      assert.strictEqual(r, 255);
      assert.strictEqual(g, 0);
      assert.strictEqual(b, 0);
    });
  });

  suite('getContrastForeground', () => {
    test('returns light foreground for dark backgrounds', () => {
      const fg = getContrastForeground('#000000');
      assert.strictEqual(fg, '#e7e7e7');
    });

    test('returns dark foreground for light backgrounds', () => {
      const fg = getContrastForeground('#ffffff');
      assert.strictEqual(fg, '#15202b');
    });
  });

  suite('adjustColor', () => {
    test('lighten makes color lighter', () => {
      const original = hexToRgb('#804020');
      const lighter = hexToRgb(adjustColor('#804020', 30));
      assert.ok(lighter.r > original.r);
      assert.ok(lighter.g > original.g);
      assert.ok(lighter.b > original.b);
    });

    test('darken makes color darker', () => {
      const original = hexToRgb('#804020');
      const darker = hexToRgb(adjustColor('#804020', -30));
      assert.ok(darker.r < original.r);
      assert.ok(darker.g < original.g);
      assert.ok(darker.b < original.b);
    });
  });

  suite('normalizeRemoteUrl', () => {
    test('SSH and HTTPS produce the same normalized form', () => {
      const ssh = normalizeRemoteUrl('git@github.com:foo/bar.git');
      const https = normalizeRemoteUrl('https://github.com/foo/bar.git');
      assert.strictEqual(ssh, https);
    });

    test('strips trailing .git', () => {
      const a = normalizeRemoteUrl('https://github.com/foo/bar.git');
      const b = normalizeRemoteUrl('https://github.com/foo/bar');
      assert.strictEqual(a, b);
    });

    test('strips trailing slashes', () => {
      const a = normalizeRemoteUrl('https://github.com/foo/bar/');
      const b = normalizeRemoteUrl('https://github.com/foo/bar');
      assert.strictEqual(a, b);
    });

    test('is case-insensitive', () => {
      const a = normalizeRemoteUrl('https://GitHub.com/Foo/Bar.git');
      const b = normalizeRemoteUrl('https://github.com/foo/bar.git');
      assert.strictEqual(a, b);
    });

    test('strips git:// protocol', () => {
      const a = normalizeRemoteUrl('git://github.com/foo/bar.git');
      const b = normalizeRemoteUrl('https://github.com/foo/bar.git');
      assert.strictEqual(a, b);
    });
  });
});
