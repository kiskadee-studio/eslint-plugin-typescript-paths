/* eslint-disable unicorn/prefer-module */
import { resolve } from 'node:path';
import { searchForFileDirectory } from '.';

describe('searchForFileDirectory method', () => {
  it('returns the correct directory when the file exists', () => {
    const result = searchForFileDirectory('package.json');
    expect(result).toBe(resolve(__dirname, '../..'));
  });

  it('returns undefined when the file does not exist', () => {
    const result = searchForFileDirectory('nonExistentFile.json');
    expect(result).toBeUndefined();
  });
});
