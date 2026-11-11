import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    fileParallelism: false,
    include: ['**/*.e2e-spec.ts'],
    env: {
      JWT_SECRET: 'jwt_secret_para_testes_com_mais_de_32_caracteres_12345',
    },
  },
});
