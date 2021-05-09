import { pipeline } from 'stream';

import processArgs from './processArgs.js';
import Transformer from "./transform.js";
import { getInputStream, getOutputStream} from './streams.js'

const args = processArgs();
const encodeSign = args['action'] === 'encode' ? 1 : -1;

let inputStream = getInputStream(args['input']);
let outputStream = getOutputStream(args['output']);
let transformStream = new Transformer({ shift: args['shift'] * encodeSign });

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
