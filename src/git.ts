/**
 * Git remote URL detection.
 */

import * as cp from 'child_process';

/**
 * Get the git remote URL for the given workspace folder path.
 * Returns null if git is not available or no remote is configured.
 */
export function getGitRemoteUrl(
  workspaceFolderPath: string,
  remoteName: string = 'origin'
): Promise<string | null> {
  return new Promise((resolve) => {
    cp.exec(
      `git remote get-url ${remoteName}`,
      { cwd: workspaceFolderPath, timeout: 5000 },
      (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }
        const url = stdout.trim();
        resolve(url || null);
      }
    );
  });
}
