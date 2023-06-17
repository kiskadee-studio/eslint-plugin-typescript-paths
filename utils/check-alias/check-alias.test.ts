import { platform } from 'node:os';
import type { Mock } from 'vitest';
import { checkAlias } from '.';

vi.mock('os', () => {
  return { platform: vi.fn() };
});

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
});
