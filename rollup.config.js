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
        input: 'src/main.js',
        output: {
            banner,
            file: 'dist/rufflib-expect.es.js', // a copy of this is used by...
            format: 'es', // ...`docs/run-nodejs-tests.js`
        }
    },
    {
        input: 'dist/rufflib-expect.es.js',
        output: {
            file: 'dist/rufflib-expect.umd.es5.min.js', // a copy of this is used by...
            format: 'umd', // ...`docs/run-browser-tests.html`
            name: 'rufflib.expect.main', // `var Expect = rufflib.expect.main`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        // and https://github.com/terser/terser#minify-options
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            terser({ keep_classnames:true }),
        ]
    },

    // Build unit test files.
    {
        input: 'src/main-test.js',
        output: {
            banner: banner.replace(' * ', ' * Unit tests for '),
            file: 'docs/test/rufflib-expect-test.es.js', // this is used by...
            format: 'es', // ...`docs/run-nodejs-tests.js`
        }
    },
    {
        input: 'docs/test/rufflib-expect-test.es.js',
        output: {
            file: 'docs/test/rufflib-expect-test.umd.js', // this is used by...
            format: 'umd', // ...`docs/run-browser-tests.html` in legacy browsers
            name: 'rufflib.expect.test' // `rufflib.expect.test(expect, Expect)`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        plugins: [
            babel({ babelHelpers: 'bundled' }),
        ]
    }

];
