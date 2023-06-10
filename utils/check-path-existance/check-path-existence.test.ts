import path from 'node:path'; // Substitua pelo caminho correto do seu módulo
import { checkPathExistence } from './check-path-existance';

describe('checkPathExistence', () => {
  test('should return true if file or directory exists', () => {
    const absolutPath = path.join(__dirname, './mocks/dir/request');
    expect(checkPathExistence(absolutPath)).toBe(true);
  });
});
