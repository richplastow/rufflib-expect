// rufflib-expect/src/methods/generate-css.js


const selectorRx = /^[.#]?[a-z][-_0-9a-z]*$/i;

/* --------------------------------- Method --------------------------------- */

// Public method which generates CSS for styling render('Html')’s output.
//
// Typical usage:
//     const $css = document.createElement('style');
//     $css.innerHTML = Expect.generateCss('pre', '#my-test-results-container');
//     document.head.appendChild($css);
//
export default function generateCss(
    containerSelector, // a CSS selector, eg '#wrap', '.test-results' or 'body'
    innerSelector, // a CSS selector like '#inner', '.box' or 'pre'
) {
    // Abbreviate the argument names - this just helps shorten the source code.
    const cs = containerSelector;
    const is = innerSelector;

    // Validate the selectors.
    if (! cs) throw Error(
        `Expect.generateCss(): the mandatory containerSelector argument is falsey`);
    if (typeof cs !== 'string') throw Error(
        `Expect.generateCss(): containerSelector is type '${typeof cs}' not 'string'`);
    if (! selectorRx.test(cs)) throw Error(
        `Expect.generateCss(): containerSelector fails ${selectorRx}`);
    if (! is) throw Error(
        `Expect.generateCss(): the mandatory innerSelector argument is falsey`);
    if (typeof is !== 'string') throw Error(
        `Expect.generateCss(): innerSelector is type '${typeof is}' not 'string'`);
    if (! selectorRx.test(is)) throw Error(
        `Expect.generateCss(): innerSelector fails ${selectorRx}`);

    // Initialise the output array.
    // Note that our validated selectors cannot include the substring '*/', here.
    const css = [`/* Expect.generateCss('${cs}', '${is}') */`];

    // The outer element is assumed to be styled already. generateCss() just
    // updates the colours when the tests complete.
    css.push(
        `${cs}.fail{background:#642c2c;color:#fce}`,
        `${cs}.pass{background:#2c642c;color:#cfe}`,
    );

    // generateCss() takes more control over styling the inner element...
    css.push(
        `${is}{padding:4px 8px;border-radius:4px;line-height:1.8}`,
        `${is}{font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,`,
        `DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif}`,
        `${is}{text-align:left;white-space:pre}`,
        `${is}{background:#222;color:#eee}`, // before the tests complete
        `${cs}.fail ${is}{background:#411;color:#fce}`,
        `${cs}.pass ${is}{background:#141;color:#cfe}`,
        `${cs}.fail hr{border-color:#642c2c}`,
        `${cs}.pass hr{border-color:#2c642c}`,
    );

    // ...and the test result content.
    css.push(
        `${is} h2{margin:0}`,
        `${is} b{color:#eee}`,
        `${is} i{font-style:normal}`,
        `${cs}.pass i{color:#7fff7f}`,
        `${is} u{padding:2px 8px;color:#fff;background:#900;text-decoration:none}`,
        `${is} s{color:#9c8293;text-decoration:none}`,
    );

    return css.join('\n');
}


/* ---------------------------------- Tests --------------------------------- */

// Tests Expect.generateCss().
export function test(expect, Expect) {
    expect().section('generateCss()');
}
