// Configuration, used by `rollup -c` during `npm run build`.

import { homepage, description, license, name, version }
    from './package.json';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const banner = `/**\n`
    + ` * ${name} ${version}\n` // will be ' * Unit tests for ...' in test files
    + ` * ${description}\n`
    + ` * ${homepage}\n`
    + ` * @license ${license}\n`
    + ` */\n\n`;

export default [

    // Build Expect’s distribution files. Tree-shaking should remove all tests.
    {
        input: 'src/entry-point-main.js',
        output: {
            banner,
            file: 'docs/dist/rufflib-expect.es.js',
            format: 'es', // eg for `node docs/run-nodejs-tests.js`
        }
    },
    {
        input: 'docs/dist/rufflib-expect.es.js',
        output: {
            file: 'docs/dist/rufflib-expect.umd.es5.min.js',
            format: 'umd', // eg for `docs/index.html` in legacy browsers
            name: 'rufflib.expect.main', // `var Expect = rufflib.expect.main`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        // and https://github.com/terser/terser#minify-options
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            terser({ keep_classnames:true })
        ]
    },

    // Build unit test distribution files.
    {
        input: 'src/entry-point-for-tests.js',
        output: {
            banner: banner.replace(' * ', ' * Unit tests for '),
            file: 'docs/dist/rufflib-expect-test.es.js',
            format: 'es', // eg for `node docs/run-nodejs-tests.js`
        }
    },
    {
        input: 'docs/dist/rufflib-expect-test.es.js',
        output: {
            file: 'docs/dist/rufflib-expect-test.umd.js',
            format: 'umd', // eg for `docs/run-browser-tests.html` in legacy browsers
            name: 'rufflib.expect.test' // `rufflib.expect.test(expect, Expect)`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        plugins: [
            babel({ babelHelpers: 'bundled' }),
        ]
    }

];
