import { Command, Option, InvalidOptionArgumentError } from 'commander/esm.mjs';

function checkInt(value) {
  if (isNaN(+value)) {
    throw new InvalidOptionArgumentError('Shift value must be a number.');
  }
  return +value;
}

export default () => {
  const program = new Command();

  program
    .addHelpText('before', 'This utility will encode or decode your input using Caesar ciphering algorithm')
    .addOption(new Option('-a, --action <encode|decode>', 'an action encode/decode')
      .choices(['encode', 'decode'])
      .makeOptionMandatory(true)
    )
    .addOption(new Option('-s, --shift <number>', 'A shift of the Caesar cipher')
      .makeOptionMandatory(true)
      .argParser(checkInt)
    )
    .option('-s, --shift <number>', 'A shift of the Caesar cipher', checkInt)
    .option('-i, --input [filename]', 'An input file. If omitted gets input from stdin')
    .option('-o, --output [filename]', 'An output file. If omitted puts result to stdout')
    .addHelpText('afterAll', '\nCreated by Odintsov Fedor at 9 May 2021');

  program.parse(process.argv);
  return program.opts();
}
