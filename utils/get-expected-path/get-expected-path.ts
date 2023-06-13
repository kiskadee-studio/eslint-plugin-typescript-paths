/* eslint-disable no-unreachable-loop,no-param-reassign */
// noinspection LoopStatementThatDoesntLoopJS

import path from 'node:path';
import { convertToUnixPath } from '@/utils/convert-to-unix-path';

export type GetExpectedPath = (
  absolutePath: string,
  baseUrl: string,
  paths: Paths
) => string | undefined;

export type Paths = { [key: string]: string[] };

export const getExpectedPath: GetExpectedPath = (
  absolutePath,
  baseUrl,
  paths
) => {
  absolutePath = convertToUnixPath(absolutePath);
  baseUrl = convertToUnixPath(baseUrl);

  const relativeToBaseUrl = path.posix.relative(baseUrl, absolutePath);
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

      const newPath = path.posix.relative(partialPath, relativeToBaseUrl);
      if (!newPath.startsWith('.')) {
        expectedPath = path.posix.join(alias, newPath);
        break;
      }
    }

    if (expectedPath) {
      break;
    }
  }

  return expectedPath || relativeToBaseUrl;
};