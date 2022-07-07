// rufflib-expect/src/expect.js


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Expect tests on itself.
function test(expect, Expect) {
    expect().section('Expect basics');
    expect(`typeof Expect // in JavaScript, a class is type 'function'`,
            typeof Expect).toBe('function');
    expect(`typeof new Expect()`,
            typeof new Expect()).toBe('object');
    // expect(`new Expect()`,
    //         new Expect()).toHave({
    //             log: [],
    //             suiteTitle: 'Untitled Test Suite',
    //         });
    // expect(`new Expect('Mathsy Test Suite')`,
    //         new Expect('Mathsy Test Suite')).toHave({
    //             log '[],
    //             suiteTitle: 'Mathsy Test Suite',
    //         });


    expect().section('Typical usage');
    expect(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
            factorialise(5)).toBe(120);

    function factorialise(n) {
        if (n === 0 || n === 1) return 1;
        for (let i=n-1; i>0; i--) n *= i;
        return n;
    }

}

// rufflib-expect/src/entry-point-for-tests.js

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
function expectTest(expect, Expect) {

    test(expect, Expect);

}

export { expectTest as default };
