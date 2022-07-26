// rufflib-expect/src/main-test.js
// (compare with rufflib-expect/main-test.js)

// Entry point for running the unit tests in Expect’s source files.
// Also used for building Expect’s unit test distribution files.

import { test as testExpect } from './expect.js';
import { test as testGenerateCss } from './methods/generate-css.js';
import { test as testRender } from './methods/render.js';
import { test as testSection } from './methods/section.js';
import { test as testThat } from './methods/that.js';

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
export default function expectTest(that, Expect) {

    testExpect(that, Expect);
    testGenerateCss(that, Expect);
    testRender(that, Expect);
    testSection(that, Expect);
    testThat(that, Expect);

}
