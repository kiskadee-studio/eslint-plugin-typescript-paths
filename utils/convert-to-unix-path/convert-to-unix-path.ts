import { platform } from 'node:os';

export const convertToUnixPath = (path: string): string => {
  if (platform() === 'win32') {
    const unixPath = path.split('\\').join('/');
    return unixPath.replace(
      /^([A-Za-z]):/,
      (_, driveLetter) => `/${driveLetter.toLowerCase()}`
    );
  }

  return path;
};
