import { convertToUnixPath } from './convert-to-unix-path'; // Replace 'your-module' with the actual module path

describe('convertToUnixPath', () => {
  it('should convert backslashes to forward slashes', () => {
    const path = 'dir\\sub-dir\\file.txt';
    const expected = 'dir/sub-dir/file.txt';
    const result = convertToUnixPath(path);
    expect(result).toBe(expected);
  });

  it('should remove consecutive slashes', () => {
    const path = 'dir////sub-dir/file.txt';
    const expected = 'dir/sub-dir/file.txt';
    const result = convertToUnixPath(path);
    expect(result).toBe(expected);
  });

  it('should remove leading Windows drive letter', () => {
    const path = 'C:/dir/file.txt';
    const expected = 'dir/file.txt';
    const result = convertToUnixPath(path);
    expect(result).toBe(expected);
  });

  it('should remove leading "./" for relative paths', () => {
    const path = './dir/file.txt';
    const expected = 'dir/file.txt';
    const result = convertToUnixPath(path);
    expect(result).toBe(expected);
  });

  it('should handle mixed slashes and backslashes', () => {
    const path = 'dir/sub-dir\\file.txt';
    const expected = 'dir/sub-dir/file.txt';
    const result = convertToUnixPath(path);
    expect(result).toBe(expected);
  });
});
