import { existsSync } from 'node:fs';
import type { Mock } from 'vitest';
import { convertToUnixPath } from '@/utils/convert-to-unix-path';
import { findExistingFile } from '.';

vi.mock('fs', () => {
  return { existsSync: vi.fn() };
});

describe('findExistingFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the path of the first existing file', () => {
    const rootDir = '/path/to/root';
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];

    (existsSync as Mock).mockReturnValueOnce(false);
    (existsSync as Mock).mockReturnValueOnce(true);

    const result = convertToUnixPath(findExistingFile(rootDir, files) || '');
    const expectedPath = 'path/to/root/file2.txt';

    expect(result).toBe(expectedPath);
    expect(existsSync).toHaveBeenNthCalledWith(1, '/path/to/root/file1.txt');
    expect(existsSync).toHaveBeenNthCalledWith(2, '/path/to/root/file2.txt');
    expect(existsSync).toHaveBeenCalledTimes(2);
  });

  it('should return undefined if no files exist', () => {
    const rootDir = '/path/to/root';
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];

    (existsSync as Mock).mockReturnValue(false);

    const result = findExistingFile(rootDir, files);

    expect(result).toBeUndefined();
    expect(existsSync).toHaveBeenCalledTimes(3);
  });
});
