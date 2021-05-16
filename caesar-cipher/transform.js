import { Transform } from 'stream';

const codeOfLittleA = 'a'.charCodeAt(0);
const codeOfBigA = 'A'.charCodeAt(0);

export default class Transformer extends Transform {
  constructor(opt = {}) {
    super(opt);
    this.shift = opt.shift;

    this.on('error', (err) => {
      console.error('Transform on error', err);
      process.exit(1);
    });
  }

  _transform(chunk, encoding, done) {
    let result = chunk.toString().split``.map((ch) => {
      if (/[a-z]/.test(ch)) {
        ch = String.fromCharCode(
          codeOfLittleA + (((this.shift % 26) + 26 + ch.charCodeAt(0) - codeOfLittleA) % 26),
        );
      }
      if (/[A-Z]/.test(ch)) {
        ch = String.fromCharCode(
          codeOfBigA + (((this.shift % 26) + 26 + ch.charCodeAt(0) - codeOfBigA) % 26),
        );
      }
      return ch;
    }).join``;

    this.push(result);
    done();
  }
}
