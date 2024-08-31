import { existsSync } from 'node:fs';
import type { Mock } from 'vitest';
import { resolve } from 'node:path';
import { searchForFileDirectory } from './index';

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
    const filename = 'package.json';

    (existsSync as Mock).mockImplementation(
      (path) => path === resolve(process.cwd(), filename)
    );

    const dir = searchForFileDirectory(filename);
    expect(dir).toBe(resolve(process.cwd()));
  });
});
