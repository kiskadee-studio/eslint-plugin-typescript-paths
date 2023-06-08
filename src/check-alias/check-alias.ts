/* eslint-disable no-param-reassign */
import type { Paths } from '@/utils/get-paths/types';

/**
 * For now, we only validate the middle part of the path, which may lead to
 * bugs. Otherwise, we will also need the baseUrl to validate whether the file
 * exists or not.
 */

export function checkAlias(
  rootDir: string,
  dirName: string,
  source: string,
  paths: Paths
): string | false {
  dirName = toUnixPath(dirName);
  rootDir = toUnixPath(rootDir);

  const sourceWithoutLastDir = source.slice(0, source.lastIndexOf('/'));
  const lastDir = source.slice(source.lastIndexOf('/') + 1);

  for (const aliasRegex of Object.keys(paths)) {
    const alias = aliasRegex.slice(0, -2);
    if (sourceWithoutLastDir.startsWith(alias)) {
      for (const originRegex of paths[aliasRegex]) {
        let origin = originRegex;
        if (originRegex === '*' || originRegex === './*') {
          origin = '.';
        } else if (origin.endsWith('/*')) {
          origin = origin.slice(0, -2);
        }
        const sourceNewOrigin = sourceWithoutLastDir
          .replace(alias, origin)
          .replace('./', `${rootDir}/`);
        if (sourceNewOrigin === dirName) {
          return `./${lastDir}`;
        }
      }
    }
  }
  return false;
}

const toUnixPath = (path: string): string =>
  path.replaceAll(/[/\\]+/g, '/').replace(/^([A-Za-z]+:|\.\/)/, '');
