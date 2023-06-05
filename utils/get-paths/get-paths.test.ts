import { getPaths } from '.';

describe('getPaths', () => {
  it('returns paths from tsconfig.json', async ({ expect }) => {
    expect(getPaths('./utils/get-paths/mocks/tsconfig1')).toStrictEqual([
      'utils/get-paths/mocks/tsconfig1/src',
      {
        '@/*': ['*'],
      },
    ]);
  });
});
