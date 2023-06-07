// import { describe } from 'vitest';
// import { getExpectedPath, getPaths } from './get-paths';
//
// describe('getPaths', () => {
//   it('returns paths from tsconfig.json', async ({ expect }) => {
//     expect(getPaths('./utils/get-paths/mocks/tsconfig1')).toStrictEqual([
//       'utils/get-paths/mocks/tsconfig1/src',
//       {
//         '@/*': ['*'],
//       },
//     ]);
//   });
//
//   describe('getImportPrefixToAlias', () => {
//     it('getExpectedPath', async () => {
//       expect(
//         getExpectedPath(
//           'C:\\Users\\kiskadee\\projects\\desafio-frontend-web\\components\\Header',
//           'C:\\Users\\kiskadee\\projects\\desafio-frontend-web',
//           { '*': '@/*' },
//           false,
//           true
//         )
//       ).toBe('@/components/Header');
//     });
//     it('getExpectedPath 2', async () => {
//       expect(
//         getExpectedPath(
//           'C:\\Users\\kiskadee\\projects\\desafio-frontend-web\\components\\NewFarm.types',
//           'C:\\Users\\kiskadee\\projects\\desafio-frontend-web',
//           { '*': '@/*' },
//           false,
//           true
//         )
//       ).toBe('@/components/NewFarm.types');
//     });
//   });
// });
