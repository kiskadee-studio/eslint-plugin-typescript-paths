/* eslint-disable unicorn/prefer-module */
import { existsSync } from 'node:fs';
import type { Mock } from 'vitest';
import { parse, resolve } from 'node:path';
import os from 'node:os';
import { searchForFileDirectory } from '.';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

describe('searchForFileDirectory function', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return the directory of the file if the file exists', () => {
    (existsSync as Mock).mockImplementation(() => true);

    const filename = 'package.json';
    const dir = searchForFileDirectory(filename);
    expect(dir).toBe(resolve(process.cwd(), filename));
  });

  it('should return undefined if the file does not exist', () => {
    (existsSync as Mock).mockImplementation(() => false);

    const filename = 'package.json';
    const dir = searchForFileDirectory(filename);
    expect(dir).toBeUndefined();
  });

  it('should stop at the root directory', () => {
    (existsSync as Mock).mockImplementation(
      (path) => path === `${parse(os.homedir()).root}package.json`
    );

    const filename = 'package.json';
    const dir = searchForFileDirectory(filename);
    expect(dir).toBe(parse(os.homedir()).root);
  });
});
