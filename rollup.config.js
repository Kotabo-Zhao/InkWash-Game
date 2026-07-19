import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'iife',
    name: 'InkRealm',
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    resolve({ browser: true }),
    commonjs(),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist' },
        { src: 'src/assets/**/*', dest: 'dist/assets' },
      ],
      flatten: false,
    }),
  ],
};
