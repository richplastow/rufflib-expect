/**
 * Unit tests for rufflib-expect 1.0.1
 * A RuffLIB library for unit testing rough and sketchy JavaScript apps.
 * https://richplastow.com/rufflib-expect
 * @license MIT
 */


// rufflib-expect/src/methods/expect.js


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.expect().
// Apologies if this seems a bit mind-bendingly self-referential — look at
// a RuffLIB Validate method test, to understand what’s going on here. @TODO provide link
function test$1(expect, Expect) {
    const testSuite = new Expect('Mathsy Test Suite');

    expect().section('expect() Basics');
    expect(`typeof testSuite.expect`,
            typeof testSuite.expect).toBe('function');
    expect(`typeof testSuite.expect()`,
            typeof testSuite.expect()).toBe('object');

    expect().section('expect().section()');
    expect(`typeof testSuite.expect().section`,
            typeof testSuite.expect().section).toBe('function');
    expect(`testSuite.expect().section('FooBar Section')`,
            testSuite.expect().section('FooBar Section')).toBe(undefined);
    expect(`testSuite.render(undefined, '', true)`,
            testSuite.render(undefined, '', true)).toMatch(/FooBar Section/);

    expect().section('expect().toBe()');
    expect(`typeof testSuite.expect().toBe`,
            typeof testSuite.expect().toBe).toBe('function');
    expect(`testSuite.expect('A', 1).toBe(1)`,
            testSuite.expect('A', 1).toBe(1)).toBe(undefined);
    expect(`testSuite`, testSuite).toHave({ failTally: 0, passTally: 1, status: 'pass' });
    expect(`testSuite.expect('B', true).toBe(1)`,
            testSuite.expect('B', true).toBe(1)).toBe(undefined);
    expect(`testSuite`, testSuite).toHave({ failTally: 1, passTally: 1, status: 'fail' });
    const obj = { ok:123 };
    expect(`testSuite.expect('C', obj).toBe(obj)`,
            testSuite.expect('C', obj).toBe(obj)).toBe(undefined);
    expect(`testSuite`, testSuite).toHave({ failTally: 1, passTally: 2, status: 'fail' });
    expect(`testSuite.expect('D', obj).toBe({ ok:123 })`,
            testSuite.expect('D', obj).toBe({ ok:123 })).toBe(undefined);
    expect(`testSuite`, testSuite).toHave({ failTally: 2, passTally: 2, status: 'fail' });

    // @TODO remaining methods

}

// rufflib-expect/src/expect.js

// Assembles the `Expect` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '1.0.1';


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Expect tests on itself.
function test(expect, Expect) {
    expect().section('Expect basics');
    expect(`typeof Expect // in JavaScript, a class is type 'function'`,
            typeof Expect).toBe('function');
    expect(`Expect.VERSION`,
            Expect.VERSION).toBe(VERSION);
    expect(`typeof new Expect()`,
            typeof new Expect()).toBe('object');
    expect(`new Expect()`,
            new Expect()).toHave({
                failTally: 0,
                passTally: 0,
                status: 'pass',
            });


    expect().section('Typical usage');

    function factorialise(n) {
        if (n === 0 || n === 1) return 1;
        for (let i=n-1; i>0; i--) n *= i;
        return n;
    }
    expect(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
            factorialise(5)).toBe(120);

    const mathsy = new Expect('Mathsy Test Suite');
    expect(`mathsy.expect('factorialise(5)', factorialise(5)).toBe(120)`,
            mathsy.expect('factorialise(5)', factorialise(5)).toBe(120)).toBe(undefined);
    expect(`mathsy`, mathsy).toHave({ failTally: 0, passTally: 1, status: 'pass' });
    expect(`mathsy.expect('factorialise(3)', factorialise(3)).toBe(77)`,
            mathsy.expect('factorialise(3)', factorialise(3)).toBe(77)).toBe(undefined);
    expect(`mathsy`, mathsy).toHave({ failTally: 1, passTally: 1, status: 'fail' });
    expect(`mathsy.render()`,
            mathsy.render()).toMatch(/Mathsy Test Suite\n={17}\nFailed 1 of 2\n/);
    expect(`mathsy.render()`,
            mathsy.render()).toMatch(/Untitled Section:\n-{17}\n/);
    expect(`mathsy.render()`,
            mathsy.render()).toMatch(/Failed factorialise\(3\):\s+expected: 77\s+actually: 6/);

}

// rufflib-expect/src/entry-point-for-tests.js
// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
function expectTest(expect, Expect) {

    test(expect, Expect);
    test$1(expect, Expect);

}

export { expectTest as default };
