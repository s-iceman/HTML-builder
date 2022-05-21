const path = require('path');
const fs = require('fs');

const PATH = path.join(__dirname, 'secret-folder');

fs.readdir(
  PATH, 
  {withFileTypes: true},
  (err, files) => {
    if (err) {
      console.error(err.message);
      return;
    } else {
      for (const f of files) {
        if (f.isFile()) {
          fs.stat(path.join(PATH, f.name), (err, stats) => {
            if (err) {
              console.error(err.message);
              return;
            } else {
              const extension = path.extname(f.name);
              console.log(`${path.basename(f.name, extension)} - ${extension.substring(1)} - ${stats.size / 1000}kb`);
            }
          });
        }
      }
    }
  }
);
