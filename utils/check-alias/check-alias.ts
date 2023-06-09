/* eslint-disable no-param-reassign */
import type { Paths } from '@/utils/get-paths/types';
import { convertToUnixPath } from '@/utils/convert-to-unix-path';

/**
 * For now, we only validate the middle part of the path, which may lead to
 * bugs. Otherwise, we will also need the baseUrl to validate whether the file
 * exists or not.
 */

export function checkAlias(
  rootDir: string,
  dirName: string,
  pathUsed: string,
  paths: Paths
): string | false {
  dirName = convertToUnixPath(dirName);
  rootDir = convertToUnixPath(rootDir);

  for (const aliasRegex of Object.keys(paths)) {
    const alias = aliasRegex.slice(0, -2);
    if (pathUsed.startsWith(alias)) {
      for (const originRegex of paths[aliasRegex]) {
        let origin = originRegex;
        if (originRegex === '*' || originRegex === './*') {
          origin = '.';
        } else if (origin.endsWith('/*')) {
          origin = origin.slice(0, -2);
        }
        const pathUsedWithNewOrigin = pathUsed
          .replace(alias, origin)
          .replace('./', `${rootDir}/`);
        if (pathUsedWithNewOrigin.startsWith(dirName)) {
          const relativePath = pathUsedWithNewOrigin.slice(dirName.length);
          return `.${relativePath}`;
        }
      }
    }
  }
  return false;
}