import { pipeline } from 'stream';
import fs from 'fs';

import processArgs from './processArgs.js';
import Transformer from "./transform.js";

const args = processArgs();
const encodeSign = args['action'] === 'encode' ? 1 : -1;

let inputStream;
let outputStream;
let transformStream = new Transformer({ shift: args['shift'] * encodeSign });

function checkFileExists(file, flags) {
  let fileExists = true;
  try {
    fs.accessSync(file, flags);
  } catch (err) {
    fileExists = false;
  }
  return fileExists;
}

if (args['input'] === undefined || args['input'] === true) {
  inputStream = process.stdin;
} else {
  if (checkFileExists(args['input'], fs.constants.F_OK | fs.constants.R_OK)) {
    inputStream = fs.createReadStream(args['input']);
  } else {
    console.error(`Error! File ${args['input']} is not exist or inaccessible for reading.`);
    process.exit(1);
  }
}

inputStream.on('error', (err) => {
  console.error(`Error! Something has happened with input stream`);
  process.exit(1);
});

if (args['output'] === undefined || args['output'] === true) {
  outputStream = process.stdout;
} else {
  if (checkFileExists(args['output'], fs.constants.F_OK | fs.constants.W_OK)) {
    outputStream = fs.createWriteStream(args['output'], {flags: 'a'});
  } else {
    console.error(`Error! File ${args['output']} is not exist or inaccessible for writing.`);
    process.exit(1);
  }
}

outputStream.on('error', (err) => {
  console.error(`Error! Something has happened with output stream`);
  process.exit(1);
});



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
