const path = require('path');
const fs = require('fs/promises');

const PATTERN = '.css';
const TARGET = path.join(__dirname, 'project-dist', 'bundle.css');
const SOURCE = path.join(__dirname, 'styles');


async function readStyles(){
  let files;
  try {
    files = await fs.readdir(SOURCE, {withFileTypes: true});
  } catch (err) {
    console.log(err.message);
    return;
  }

  let buffer = [];
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === PATTERN) {
      try {
        let content = await fs.readFile(path.join(SOURCE, file.name));
        buffer.push(content.toString(), '\n');
      } catch (err) {
        console.log(err.message);
        return;
      }
    }
  }

  if (buffer) {
    await fs.writeFile(TARGET, buffer.join('\n'));
  } else {
    console.error('There are not available styles to write them');
  }
}

readStyles();
