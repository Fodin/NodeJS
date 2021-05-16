import fs from 'fs';

function checkFileExists(file, flags) {
  let fileExists = true;
  try {
    fs.accessSync(file, flags);
  } catch (err) {
    fileExists = false;
  }
  return fileExists;
}

const getInputStream = (streamName) => {
  let inputStream;
  if (streamName === undefined || streamName === true) {
    inputStream = process.stdin;
  } else {
    if (checkFileExists(streamName, fs.constants.F_OK | fs.constants.R_OK)) {
      inputStream = fs.createReadStream(streamName);
    } else {
      console.error(`Error! File ${streamName} is not exist or inaccessible for reading.`);
      process.exit(1);
    }
  }

  inputStream.on('error', (err) => {
    console.error(`Error! Something has happened with input stream`);
    process.exit(1);
  });
  return inputStream;
};

const getOutputStream = (streamName) => {
  let outputStream;
  if (streamName === undefined || streamName === true) {
    outputStream = process.stdout;
  } else {
    if (checkFileExists(streamName, fs.constants.F_OK | fs.constants.W_OK)) {
      outputStream = fs.createWriteStream(streamName, { flags: 'a' });
    } else {
      console.error(`Error! File ${streamName} is not exist or inaccessible for writing.`);
      process.exit(1);
    }
  }

  outputStream.on('error', (err) => {
    console.error(`Error! Something has happened with output stream`);
    process.exit(1);
  });

  return outputStream;
};

export { getInputStream, getOutputStream };
