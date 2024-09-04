/* eslint-disable no-unreachable-loop,no-param-reassign */
// noinspection LoopStatementThatDoesntLoopJS

import { posix, resolve, relative } from 'node:path';

import type { Paths } from '@/utils/get-tsconfig-paths';

function getExpectedPath(
  /*
   * `absolutePath` and `baseUrl` must be in Unix format
   */
  absolutePath: string,
  baseUrl: string,
  paths: Paths
): string {
  /**
   * Given that baseUrl and absolutPath are in Unix format, posix is used to
   * maintain compatibility.
   */
  const resolveToBaseUrl = resolve(baseUrl, absolutePath);
  const relativeToBaseUrl = relative(resolveToBaseUrl, absolutePath);
  let expectedPath = '';

  for (const aliasRegex of Object.keys(paths)) {
    const alias = aliasRegex.replace(/\/\*$/, '');
    const aliasPaths = paths[aliasRegex];

    for (const originPath of aliasPaths) {
      let partialPath = '';

      if (originPath === '*') {
        partialPath = '';
      } else if (originPath.endsWith('/*')) {
        partialPath = originPath.replace('/*', '');
      }

      /**
       * Both newPath and expectedPath should be in Unix format.
       */
      const newPath = posix.resolve(partialPath, relativeToBaseUrl);
      if (!newPath.startsWith('.')) {
        expectedPath = posix.join(alias, newPath);
        break;
      }
    }

    if (expectedPath) {
      break;
    }
  }

  return expectedPath || relativeToBaseUrl;
}

export { getExpectedPath };
