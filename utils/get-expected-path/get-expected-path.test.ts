import type { Paths } from '@/utils/get-expected-path/get-expected-path.types';
import { getExpectedPath } from './get-expected-path';

describe('getExpectedPath method', () => {
  it('should return the expected path when a match is found - Test 1', () => {
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
    const baseUrl = 'C:\\path\\to\\base';
    const absolutePath = 'C:\\path\\to\\base\\src\\components\\Header';
    const paths: Paths = {
      '@component': ['src/visual/*', 'src/components/*'],
      '@/*': ['src/*'],
    };

    const expected = '@component/Header';
    const result = getExpectedPath(absolutePath, baseUrl, paths);

    expect(result).toBe(expected);
  });

  it('should return the expected path when a match is found - Test 3', () => {
    const baseUrl = 'C:\\path\\to\\base';
    const absolutePath = 'C:\\path\\to\\base\\src\\components\\Header';
    const paths: Paths = {
      '@component': ['src/components/*', 'src/visual/*'],
      '@/*': ['src/*'],
    };

    const expected = '@component/Header';
    const result = getExpectedPath(absolutePath, baseUrl, paths);

    expect(result).toBe(expected);
  });

  it('should return the expected path when a match is found - Test 4', () => {
    const baseUrl = 'C:\\path\\to\\base';
    const absolutePath = 'C:\\path\\to\\base\\src\\components\\Header';
    const paths: Paths = {};

    const expected = 'src/components/Header';
    const result = getExpectedPath(absolutePath, baseUrl, paths);

    expect(result).toBe(expected);
  });

  it('should return the expected path when a match is found - Test 5', () => {
    const baseUrl = 'C:\\path\\to\\base';
    const absolutePath =
      'C:\\path\\to\\base\\flows\\User\\New\\components\\Form\\Form.style';
    const paths: Paths = {
      '@/*': ['./*'],
    };

    const expected = '@/flows/User/New/components/Form/Form.style';
    const result = getExpectedPath(absolutePath, baseUrl, paths);

    expect(result).toBe(expected);
  });
});
