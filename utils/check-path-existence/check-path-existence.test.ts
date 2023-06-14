import { existsSync } from 'node:fs';
import type { Mock } from 'vitest';
import { checkPathExistence } from '.';

vi.mock('fs', () => ({ existsSync: vi.fn() }));

describe('checkPathExistence method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it('should return true if the path exists 0', () => {
  //   const result = checkPathExistence(
  //     'C:\\Users\\rodri\\projects\\desafio-frontend-web\\flows\\Farm\\New\\components\\Form\\Form.style'
  //   );
  //
  //   expect(result).toBe(true);
  // });

  it('should return true if the path exists', () => {
    const path = '/path/to/existing/file.txt';

    (existsSync as Mock).mockReturnValue(true);

    const result = checkPathExistence(path);

    expect(result).toBe(true);
    expect(existsSync).toHaveBeenCalledWith(path);
  });

  it('should return true if the path with supported extensions exists', () => {
    const path = '/path/to/file';

    (existsSync as Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

    const result = checkPathExistence(path);

    expect(result).toBe(true);
    expect(existsSync).toHaveBeenCalledWith(path);
    expect(existsSync).toHaveBeenCalledWith(`${path}.ts`);
    expect(existsSync).toHaveBeenCalledTimes(2);
  });

  it('should return false if the path and supported extensions do not exist', () => {
    const path = '/path/to/nonexistent/file';

    (existsSync as Mock).mockReturnValue(false);

    const result = checkPathExistence(path);

    expect(result).toBe(false);
    expect(existsSync).toHaveBeenCalledWith(path);
    expect(existsSync).toHaveBeenCalledWith(`${path}.ts`);
    expect(existsSync).toHaveBeenCalledWith(`${path}.tsx`);
    expect(existsSync).toHaveBeenCalledWith(`${path}.js`);
    expect(existsSync).toHaveBeenCalledWith(`${path}.jsx`);
    expect(existsSync).toHaveBeenCalledTimes(5);
  });
});
