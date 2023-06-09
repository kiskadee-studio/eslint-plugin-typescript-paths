export const convertToUnixPath = (path: string): string =>
  path.replaceAll(/[/\\]+/g, '/').replace(/^(?:[A-Za-z]+:)?\.?\//, '');
