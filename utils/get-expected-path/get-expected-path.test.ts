import type { Paths } from './get-expected-path';
import { getExpectedPath } from './get-expected-path';

describe('getExpectedPath', () => {
  it('should return the expected path when a match is found', () => {
    const baseUrl = '/base';
    const absolutePath = '/base/path/to/file';
    const paths: Paths = {
      alias1: ['./path/*', './path2/*'],
      alias2: ['./path3/utils/*', './path4/*'],
    };

    const expected = 'alias1/to/file';
    const result = getExpectedPath(absolutePath, baseUrl, paths);

    expect(result).toBe(expected);
  });

  it('should return the expected path when a match is found - Test 2', () => {
    const baseUrl = 'C:\\Users\\rodri\\projects\\desafio-frontend-web';
    const absolutePath =
      'C:\\Users\\rodri\\projects\\desafio-frontend-web\\src\\components\\Header';
    const paths: Paths = {
      '@component': ['src/visual/*', 'src/components/*'],
      '@/*': ['src/*'],
    };

    const expected = '@component/Header';
    const result = getExpectedPath(absolutePath, baseUrl, paths);

    expect(result).toBe(expected);
  });

  it('should return the expected path when a match is found - Test 3', () => {
    const baseUrl = 'C:\\Users\\rodri\\projects\\desafio-frontend-web';
    const absolutePath =
      'C:\\Users\\rodri\\projects\\desafio-frontend-web\\src\\components\\Header';
    const paths: Paths = {
      '@component': ['src/components/*', 'src/visual/*'],
      '@/*': ['src/*'],
    };

    const expected = '@component/Header';
    const result = getExpectedPath(absolutePath, baseUrl, paths);

    expect(result).toBe(expected);
  });

  it('should return the expected path when a match is found - Test 4', () => {
    const baseUrl = 'C:\\Users\\rodri\\projects\\desafio-frontend-web';
    const absolutePath =
      'C:\\Users\\rodri\\projects\\desafio-frontend-web\\src\\components\\Header';
    const paths: Paths = {};

    const expected = 'src/component/Header';
    const result = getExpectedPath(absolutePath, baseUrl, paths);

    expect(result).toBe(expected);
  });
});
