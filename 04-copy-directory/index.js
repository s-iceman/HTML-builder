const path = require('path');
const fs = require('fs');

const SRC = path.join(__dirname, 'files');
const COPY = path.join(__dirname, 'files-copy');

function copyDir() {
  try {
    fs.mkdir(COPY, {recursive: true}, () => {});
  } catch (err) {
    console.error(err.message);
    return;
  }

  fs.readdir(
    SRC, (err, files) => {
      if (err) {
        console.error(err.message);
        return;
      } else {
        for (const file of files) {
          fs.copyFile(
            path.join(SRC, file),
            path.join(COPY, file),
            () => {}
          );
        }
      }
    }
  );
}

copyDir();