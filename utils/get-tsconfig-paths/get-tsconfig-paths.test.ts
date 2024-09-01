import { readFileSync } from 'node:fs';
import * as jsonParser from 'jsonc-parser';
import type { Mock } from 'vitest';

import { findExistingFile } from '@/utils/find-existing-file';
import { getTSConfigPaths } from './index';
import type { Paths, TSConfig } from './index';

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

describe('getTSConfigPaths method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the base URL and paths', () => {
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

    expect(result).toEqual({
      baseUrl: expectedBaseURL,
      paths: expectedPaths,
    });
    expect(findExistingFile).toHaveBeenCalledWith(rootDir, [
      'tsconfig.json',
      'jsconfig.json',
    ]);
    expect(readFileSync).toHaveBeenCalledWith(configPath);
    expect(jsonParser.parse).toHaveBeenCalledWith(JSON.stringify(tsconfig));
  });

  it('should return default values when config path is not found', () => {
    const rootDir = '/path/to/project';
    const expectedPaths: Paths = {};

    const result = getTSConfigPaths(rootDir);

    expect(result).toEqual({
      baseUrl: rootDir,
      paths: expectedPaths,
    });
    expect(findExistingFile).toHaveBeenCalledWith(rootDir, [
      'tsconfig.json',
      'jsconfig.json',
    ]);
    expect(readFileSync).not.toHaveBeenCalled();
    expect(jsonParser.parse).not.toHaveBeenCalled();
  });
});
