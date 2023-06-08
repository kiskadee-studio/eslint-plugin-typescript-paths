// eslint-disable-next-line import/no-extraneous-dependencies
import { describe } from 'vitest';
import { checkAlias } from './check-alias';

describe('checkAlias', () => {
  it('returns relative import from current directory - 01', async ({
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
  it('returns relative import from current directory - 02', async ({
    expect,
  }) => {
    expect(
      checkAlias('C:/kiskadee', 'C:/kiskadee/src/request', '@request/get', {
        '@request/*': ['./src/request/*'],
      })
    ).toBe('./get');
  });
  it('returns relative import from current directory - 03', async ({
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
  it('returns relative import from current directory - 04', async ({
    expect,
  }) => {
    expect(
      checkAlias(
        'C:\\Users\\rodri\\projects\\desafio-frontend-web',
        'C:\\Users\\rodri\\projects\\desafio-frontend-web\\flows\\Farm\\New',
        '@/flows/Farm/New/NewFarmTypes',
        {
          '@/*': ['*'],
        }
      )
    ).toBe('./NewFarmTypes');
  });
});
