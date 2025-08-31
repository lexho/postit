import { readFileSync, writeFileSync, copyFileSync, constants } from 'node:fs';
import path from 'node:path';

export function copy() {
    copyFileSync('./public/createDOM.js', './test/createDOM.js');
    let logPath = './test/createDOM.js';
    let logRows = readFileSync(logPath).toString().split('\n');
    logRows.unshift('export');
    writeFileSync(logPath, logRows.join(" "));
}

copy()