import { getExpectedPath, getPaths } from './get-paths';

describe('getPaths', () => {
  it('returns paths from tsconfig.json', async ({ expect }) => {
    expect(getPaths('./utils/get-paths/mocks/tsconfig1')).toStrictEqual([
      'utils/get-paths/mocks/tsconfig1/src',
      {
        '@/*': ['*'],
      },
    ]);
  });

  it('getExpectedPath', async () => {
    expect(
      getExpectedPath(
        'C:\\Users\\kiskadee\\projects\\desafio-frontend-web\\components\\Header',
        'C:\\Users\\kiskadee\\projects\\desafio-frontend-web',
        { '*': '@/*' },
        false,
        true
      )
    ).toBe('@/components/Header');
  });
});
