import type { Paths } from '@/utils/get-paths/types';

export function getImportPrefixToAlias(paths: Paths = {}): {
  [key: string]: string;
} {
  const reversed: { [k: string]: string } = {};
  for (const key of Object.keys(paths)) {
    for (const p of paths[key]) {
      reversed[p] = key;
    }
  }
  return reversed;
}
