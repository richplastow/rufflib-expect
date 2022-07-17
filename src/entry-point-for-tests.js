// rufflib-expect/src/entry-point-for-tests.js

// Entry point for running the unit tests in Expect’s source files.
// Also used for building Expect’s unit test distribution files.

import { test as testExpect } from './expect.js';
import { test as testExpectExpect } from './methods/expect.js';
import { test as testGenerateCss } from './methods/generate-css.js';
import { test as testRender } from './methods/render.js';

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
export default function expectTest(expect, Expect) {

    testExpect(expect, Expect);
    testExpectExpect(expect, Expect);
    testGenerateCss(expect, Expect);
    testRender(expect, Expect);

}
