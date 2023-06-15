import { platform } from 'node:os';
import type { Mock } from 'vitest';
import { convertToUnixPath } from '.'; // Import the function you want to test

vi.mock('os', () => {
  return { platform: vi.fn() };
});

describe('convertToUnixPath method', () => {
  afterEach(() => {
    vi.clearAllMocks(); // Clear all mocks after each test
  });

  it('should convert Windows path to Unix path', () => {
    (platform as Mock).mockImplementationOnce(() => 'win32');

    const windowsPath = 'C:\\Users\\Test\\Documents\\file.txt';
    const expectedUnixPath = 'Users/Test/Documents/file.txt';
    const actualUnixPath = convertToUnixPath(windowsPath);

    expect(actualUnixPath).toEqual(expectedUnixPath);
  });

  it('should not change the Unix path', () => {
    (platform as Mock).mockImplementationOnce(() => 'darwin');

    const unixPath = '/Users/Test/Documents/file.txt';
    const actualUnixPath = convertToUnixPath(unixPath);

    expect(actualUnixPath).toEqual(unixPath);
  });
});
