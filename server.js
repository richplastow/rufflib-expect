// server.js

// A simple static server, handy for development and testing.

/* --------------------------------- Imports -------------------------------- */

import child_process from 'child_process';
import fs from 'fs';
import http from 'node:http';


/* -------------------------------- Constants ------------------------------- */

const hostname = '127.0.0.1'; // localhost
const port = 4321;


/* ----------------------------------- Env ---------------------------------- */

// `npm start --open` or `npm start -o` means we should open a browser window.
const doOpen = process.env.npm_config_open || process.env.npm_config_o;

// `npm start --src` means we should use the src/ folder, not docs/.
const dir = process.env.npm_config_src ? 'src' : 'docs';

// `npm start --test` or `npm start -t` opens run-browser-tests.html not index.html.
const doTest = process.env.npm_config_test || process.env.npm_config_t;


/* --------------------------------- Server --------------------------------- */

// Create the server.
// Based on https://stackoverflow.com/a/40899767
const server = http.createServer((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const readStream = fs.createReadStream(`${dir}${url}`);
    readStream.on('open', function () {
        res.setHeader('Content-Type', getMimetype(url));
        readStream.pipe(res);
    });
    readStream.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
});

// Start the server.
server.listen(port, hostname, () =>
    console.log(`Serving ${dir}/ at http://${hostname}:${port}/`)
);

// Open a Browser Window, if the '--open' or '-o' command line option was set.
// Visit 'run-browser-tests.html', if the '--test' or '-t' option was set, or
// otherwise visit 'index.html'.
// Based on https://stackoverflow.com/a/49013356
// @TODO test on Windows and Linux
if (doOpen) {
    const openCommand = process.platform === 'darwin'
        ? 'open'
        : process.platform === 'win32'
            ? 'start'
            : 'xdg-open'
    ;
    const filename = doTest
        ? 'run-browser-tests.html'
        : 'index.html'
    ;
    const fullUrl = `http://${hostname}:${port}/${filename}`;
    console.log(`Opening ${fullUrl} in your default browser...`);
    child_process.exec(`${openCommand} ${fullUrl}`);
}


/* --------------------------------- Helpers -------------------------------- */

// Infer the Content-Type header from a file extension.
function getMimetype(url) {
    const ext = url.split('.').pop().toLowerCase();
    const mimetype = {
        css: 'text/css',
        gif: 'image/gif',
        htm: 'text/html',
        html: 'text/html',
        ico: 'image/x-icon',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        js: 'application/javascript',
        json: 'application/json',
        png: 'image/png',
        svg: 'image/svg+xml',
        txt: 'text/plain',
        xml: 'text/xml',
    }[ext];
    if (! mimetype) throw Error(`url '${url}' has unexpected extension '.${ext}'`);
    return mimetype;
}
