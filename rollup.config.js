import { version } from './package.json'
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

const banner = `/*!
 * vue-event v${version}
 * https://github.com/peter-moon/vue-event
 * @license MIT
 */`

export default {
  input: './src/index.js',
  output: [{
    file: './dist/vue-event.esm.js',
    format: 'es',
    banner
  }, {
    file: './dist/vue-event.common.js',
    format: 'cjs',
    banner
  }, {
    file: './dist/vue-event.js',
    format: 'umd',
    name: 'VueEvent',
    banner
  }],
  plugins: [
      minify(),
      babel({
          babelrc: true,
          exclude: './node_modules/**'
      })
  ]
}
