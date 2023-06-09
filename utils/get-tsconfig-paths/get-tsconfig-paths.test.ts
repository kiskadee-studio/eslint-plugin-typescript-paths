import { readFileSync } from 'node:fs';
import { findExistingFile } from '@/utils/find-existing-file';
import type { Mock } from 'vitest';
import * as jsonParser from 'jsonc-parser';
import { convertToUnixPath } from '@/utils/convert-to-unix-path';
import type { Paths, TSConfig } from '.';
import { getTSConfigPaths } from '.';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}));

vi.mock('@/utils/find-existing-file', () => ({
  findExistingFile: vi.fn(),
}));

vi.mock('jsonc-parser', () => ({
  parse: vi.fn(),
}));

describe('getPaths method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct base URL and paths', () => {
    const rootDir = '/path/to/project';
    const configPath = '/path/to/project/tsconfig.json';
    const tsconfig: TSConfig = {
      compilerOptions: {
        baseUrl: 'src',
        paths: {
          '@/*': ['src/*'],
          'components/*': ['src/components/*'],
        },
      },
    };

    (findExistingFile as Mock).mockReturnValueOnce(configPath);
    (readFileSync as Mock).mockReturnValueOnce(JSON.stringify(tsconfig));
    (jsonParser.parse as Mock).mockReturnValueOnce(tsconfig);

    const expectedPaths: Paths = {
      '@/*': ['src/*'],
      'components/*': ['src/components/*'],
    };
    const expectedBaseURL = '/path/to/project/src';
    const result = getTSConfigPaths(rootDir);
    result!.baseUrl = convertToUnixPath(result?.baseUrl ?? '');

    expect(result).toEqual({
      baseUrl: convertToUnixPath(expectedBaseURL),
      paths: expectedPaths,
    });
    expect(findExistingFile).toHaveBeenCalledWith(rootDir, [
      'tsconfig.json',
      'jsconfig.json',
    ]);
    expect(readFileSync).toHaveBeenCalledWith(configPath);
    expect(jsonParser.parse).toHaveBeenCalledWith(JSON.stringify(tsconfig));
  });

  it('should return default values when configPath is not found', () => {
    const rootDir = '/path/to/project';
    const expectedPaths: Paths = {};

    const result = getTSConfigPaths(rootDir);
    result!.baseUrl = convertToUnixPath(result?.baseUrl ?? '');

    expect(result).toEqual({
      baseUrl: convertToUnixPath(rootDir),
      paths: expectedPaths,
    });
    expect(findExistingFile).toHaveBeenCalledWith(rootDir, [
      'tsconfig.json',
      'jsconfig.json',
    ]);
    expect(readFileSync).not.toHaveBeenCalled();
    expect(jsonParser.parse).not.toHaveBeenCalled();
  });

  it('should return undefined when rootDir is not specified', () => {
    const rootDir: string | undefined = undefined;
    const result = getTSConfigPaths(rootDir);

    expect(result).toBeUndefined();
    expect(findExistingFile).not.toHaveBeenCalled();
    expect(readFileSync).not.toHaveBeenCalled();
    expect(jsonParser.parse).not.toHaveBeenCalled();
  });
});
