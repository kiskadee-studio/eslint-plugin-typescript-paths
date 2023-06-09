import { getImportPrefixToAlias } from './get-import-prefix-to-alias';

describe('getImportPrefixToAlias', () => {
  it('should return an empty object when paths parameter is not provided', () => {
    const result = getImportPrefixToAlias();

    expect(result).toEqual({});
  });

  it('should return the reversed object of paths', () => {
    const paths = {
      alias1: ['path1', 'path2'],
      alias2: ['path3', 'path4'],
    };
    const expected = {
      path1: 'alias1',
      path2: 'alias1',
      path3: 'alias2',
      path4: 'alias2',
    };

    const result = getImportPrefixToAlias(paths);

    expect(result).toEqual(expected);
  });

  it('should handle an empty paths object', () => {
    const paths = {};
    const expected = {};

    const result = getImportPrefixToAlias(paths);

    expect(result).toEqual(expected);
  });

  it('should handle an empty array of paths for an alias', () => {
    const paths = {
      alias1: [],
      alias2: ['path1', 'path2'],
    };
    const expected = {
      path1: 'alias2',
      path2: 'alias2',
    };

    const result = getImportPrefixToAlias(paths);

    expect(result).toEqual(expected);
  });

  it('should handle duplicate paths across different aliases', () => {
    const paths = {
      alias1: ['path1', 'path2'],
      alias2: ['path2', 'path3'],
    };
    const expected = {
      path1: 'alias1',
      path2: 'alias2',
      path3: 'alias2',
    };

    const result = getImportPrefixToAlias(paths);

    expect(result).toEqual(expected);
  });

  it('should handle the same path in multiple aliases', () => {
    const paths = {
      alias1: ['path1', 'path2'],
      alias2: ['path2', 'path3'],
    };
    const expected = {
      path1: 'alias1',
      path2: ['alias1', 'alias2'],
      path3: 'alias2',
    };

    const result = getImportPrefixToAlias(paths);

    expect(result).toEqual(expected);
  });
});
