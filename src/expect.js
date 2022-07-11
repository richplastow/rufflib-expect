// rufflib-expect/src/expect.js

// Assembles the `Expect` class.


/* --------------------------------- Import --------------------------------- */

import generateCss from './methods/generate-css.js';
import expect from './methods/expect.js';
import render from './methods/render.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for unit testing rough and sketchy JavaScript apps.
//
// Typical usage:
//     const testSuite = new Expect('Mathsy Test Suite');
//     const expect = testSuite.expect;
//     expect.section('Check that factorialise() works as expected');
//
//     expect(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
//             factorialise(5)).toBe(120);
//     testSuite.render();
//
//     function factorialise(n) {
//         if (n === 0 || n === 1) return 1;
//         for (let i=n-1; i>0; i--) n *= i;
//         return n;
//     }
//     
export default class Expect {
    constructor(suiteTitle='Untitled Test Suite') {
        this.expect = expect.bind(this);
        this.log = [];
        this.sections = [];
        this.suiteTitle = suiteTitle;

        // No tests have run yet, so no failures and no passes.
        // So technically, the test suite status is currently ‘pass’.
        this.failTally = 0;
        this.passTally = 0;
        this.status = 'pass';
    }
}

Expect.generateCss = generateCss;
Expect.prototype.render = render;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Expect tests on itself.
export function test(expect, Expect) {
    expect().section('Expect basics');
    expect(`typeof Expect // in JavaScript, a class is type 'function'`,
            typeof Expect).toBe('function');
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
