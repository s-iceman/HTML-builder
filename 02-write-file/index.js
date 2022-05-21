const path = require('path');
const readline = require('readline');
const fs = require('fs');


const {stdin, stdout} = process;
const fileOutput = fs.createWriteStream(
  path.join(__dirname, 'text.txt')
);
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});
rl.write('Input your text, please:\n');

rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
  } else {
    fileOutput.write(line + '\n');
  }
});

rl.on('SIGINT', () => {
  rl.close();
});
rl.on('close', () => {
  fileOutput.write(rl.line);
  stdout.write('Your text was saved.\n');
});