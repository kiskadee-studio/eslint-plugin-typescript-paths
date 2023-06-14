/* eslint-disable no-unreachable-loop,no-param-reassign */
// noinspection LoopStatementThatDoesntLoopJS

import { posix } from 'node:path';
import { convertToUnixPath } from '@/utils/convert-to-unix-path';
import type { Paths } from '@/utils/get-tsconfig-paths';

export function getExpectedPath(
  absolutePath: string,
  baseUrl: string,
  paths: Paths
): string {
  absolutePath = convertToUnixPath(absolutePath);
  baseUrl = convertToUnixPath(baseUrl);

  const relativeToBaseUrl = posix.relative(baseUrl, absolutePath);
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

      const newPath = posix.relative(partialPath, relativeToBaseUrl);
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
