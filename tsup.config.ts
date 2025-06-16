import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', "cjs"],
  target: 'esnext',
  tsconfig: './tsconfig.json',
  dts: true,
  sourcemap: true,
  clean: true,
  shims: true,
});