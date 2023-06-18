/* eslint-disable no-param-reassign,unicorn/prefer-module */
import type { Paths } from '@/utils/get-tsconfig-paths';
import { convertToUnixPath } from '@/utils/convert-to-unix-path';
import { join } from 'node:path';
import { checkPathExistence } from '@/utils/check-path-existence';

export function checkAlias(
  rootDir: string,
  dirName: string,
  pathUsed: string,
  paths: Paths
): string | false {
  if (
    !pathUsed.startsWith('./') &&
    Object.keys(paths).length === 0 &&
    checkPathExistence(join(rootDir, pathUsed)) &&
    dirName === rootDir
  ) {
    return `./${pathUsed}`;
  }

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
