import { platform } from 'node:os';

export const convertToUnixPath = (path: string): string => {
  if (platform() === 'win32') {
    return path.replaceAll(/[/\\]+/g, '/').replace(/^(?:[A-Za-z]+:)?\.?\//, '');
  }
  return path;
};
