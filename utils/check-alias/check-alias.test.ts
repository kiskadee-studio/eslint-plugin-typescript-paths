import { platform } from 'node:os';
import type { Mock } from 'vitest';
import { checkPathExistence } from '@/utils/check-path-existence';
import { checkAlias } from '.';

vi.mock('os', () => ({ platform: vi.fn() }));

vi.mock('@/utils/check-path-existence', () => ({
  checkPathExistence: vi.fn(),
}));

describe('checkAlias function', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return relative import from current directory when given absolute paths - Test Case 1', async ({
    expect,
  }) => {
    expect(
      checkAlias(
        'C:/kiskadee',
        'C:/kiskadee/mocks/components',
        '@/mocks/components/Button',
        {
          '@/*': ['./*'],
        }
      )
    ).toBe('./Button');
  });

  it('should return relative import from current directory when given absolute paths - Test Case 2', async ({
    expect,
  }) => {
    expect(
      checkAlias('C:/kiskadee', 'C:/kiskadee/src/request', '@request/get', {
        '@request/*': ['./src/request/*'],
      })
    ).toBe('./get');
  });

  it('should return relative import from current directory when given absolute paths - Test Case 3', async ({
    expect,
  }) => {
    expect(
      checkAlias(
        'C:/kiskadee',
        'C:/kiskadee/flows/Farm/New',
        '@/flows/Farm/New/NewFarmTypes',
        {
          '@/*': ['*'],
        }
      )
    ).toBe('./NewFarmTypes');
  });

  it('should return relative import from current directory when given absolute paths - Test Case 4', async ({
    expect,
  }) => {
    (platform as Mock).mockImplementation(() => 'win32');

    expect(
      checkAlias(
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web',
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web\\flows\\Farm\\New',
        '@/flows/Farm/New/NewFarmTypes',
        {
          '@/*': ['*'],
        }
      )
    ).toBe('./NewFarmTypes');
  });

  it('should return relative import from current directory when given absolute paths - Test Case 5', async ({
    expect,
  }) => {
    (platform as Mock).mockImplementation(() => 'win32');

    expect(
      checkAlias(
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web',
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web\\flows\\Farm\\New',
        '@/flows/Farm/New/components/SaveButton',
        {
          '@/*': ['*'],
        }
      )
    ).toBe('./components/SaveButton');
  });

  it('should return relative import from current directory when given absolute paths - Test Case 6', async ({
    expect,
  }) => {
    (platform as Mock).mockImplementation(() => 'win32');
    (checkPathExistence as Mock).mockImplementation(() => true);

    expect(
      checkAlias(
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web',
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web',
        'hello.type',
        {}
      )
    ).toBe('./hello.type');
  });

  it('should return relative import from current directory when given absolute paths - Test Case 7', async ({
    expect,
  }) => {
    (platform as Mock).mockImplementation(() => 'win32');
    (checkPathExistence as Mock).mockImplementation(() => true);

    expect(
      checkAlias(
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web',
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web\\flows\\Farm\\New',
        'components/Header',
        {}
      )
    ).toBe(false);
  });

  it('should return relative import from current directory when given absolute paths - Test Case 8', async ({
    expect,
  }) => {
    (platform as Mock).mockImplementation(() => 'win32');
    (checkPathExistence as Mock).mockImplementation(() => true);

    expect(
      checkAlias(
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web',
        'C:\\Users\\rodrigo\\projects\\desafio-frontend-web',
        'hello.type',
        {}
      )
    ).toBe('./hello.type');
  });
});
