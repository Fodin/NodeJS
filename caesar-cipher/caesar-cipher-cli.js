import { pipeline } from 'stream';
import fs from 'fs';

import processArgs from './processArgs.js';
import Transformer from "./transform.js";

const args = processArgs();
const encodeSign = args['action'] === 'encode' ? 1 : -1;

let inputStream;
let outputStream;
let transformStream = new Transformer({ shift: args['shift'] * encodeSign });

if (args['input'] === undefined || args['input'] === true) {
  inputStream = process.stdin;
} else {
  inputStream = fs.createReadStream(args['input']);
}

if (args['output'] === undefined || args['output'] === true) {
  outputStream = process.stdout;
} else {
  outputStream = fs.createWriteStream(args['output'], {flags: 'a'});
}

pipeline(
  inputStream,
  transformStream,
  outputStream,
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
      process.exit(1);
    }
  }
);
