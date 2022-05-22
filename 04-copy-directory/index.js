const path = require('path');
const fs = require('fs/promises');

const SRC = path.join(__dirname, 'files');
const COPY = path.join(__dirname, 'files-copy');

async function rmDir(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  await Promise.all(entries.map(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? rmDir(fullPath) : fs.unlink(fullPath);
  }));
  await fs.rmdir(dir);
}

async function copyDir() {
  const isDirExists = !!(await fs.stat(COPY).catch(e => false));
  if (isDirExists) {
    await rmDir(COPY);
  }

  try {
    await fs.mkdir(COPY, {recursive: true}, () => {});
    const files = await fs.readdir(SRC);
    for (const file of files) {
      fs.copyFile(path.join(SRC, file), path.join(COPY, file));
    }
  } catch (err) {
    console.error(err.message);
    return;
  }
}

copyDir();