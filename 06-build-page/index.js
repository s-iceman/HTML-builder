const path = require('path');
const fs = require('fs/promises');

const TARGET = path.join(__dirname, 'project-dist');

async function rmDir(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  await Promise.all(entries.map(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? rmDir(fullPath) : fs.unlink(fullPath);
  }));
  await fs.rmdir(dir);
}

async function createMain(){
  let content = await (await fs.readFile(path.join(__dirname, 'template.html'))).toString();

  const dirPath = path.join(__dirname, 'components');
  const entries = await fs.readdir(dirPath, {withFileTypes: true});
  for (const entry of entries) {
    if (entry.isFile()){
      const file = entry.name;
      const extension = path.extname(file);
      if (extension !== '.html') {
        continue;
      }
      const pattern = '{{' + path.basename(file, extension) + '}}';
      let fragment = await fs.readFile(path.join(dirPath, file));
      content = content.replace(pattern, fragment.toString());
    }
  }
  await fs.writeFile(path.join(TARGET, 'index.html'), content);
}

async function readStyles() {
  const dirPath = path.join(__dirname, 'styles');
  const files = await fs.readdir(dirPath, {withFileTypes: true});
  if (!files){
    return;
  }

  let buffer = [];
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      let content = await fs.readFile(path.join(dirPath, file.name));
      buffer.push(content.toString(), '\n');
    }
  }

  if (buffer) {
    await fs.writeFile(path.join(TARGET, 'style.css'), buffer.join('\n'));
  }
}

async function copyAssets(sourcePath, targetPath, dirName){
  await fs.mkdir(path.join(targetPath, dirName), {recursive: true});
  const entries = await fs.readdir(path.join(sourcePath, dirName), {withFileTypes: true});
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await copyAssets(
        path.join(sourcePath, dirName),
        path.join(targetPath, dirName),
        entry.name);
    } 
    else if (entry.isFile()) {
      await fs.copyFile(
        path.join(sourcePath, dirName, entry.name),
        path.join(targetPath, dirName, entry.name)
      );
    }
  }
}

async function buildPage() {
  try {
    await fs.mkdir(TARGET, {recursive: true});
    await createMain();
    await readStyles();

    const assetsPath = path.join(TARGET, 'assets');
    const isDirExists = !!(await fs.stat(assetsPath).catch(e => false));
    if (isDirExists) {
      await rmDir(assetsPath);
    }
    await copyAssets(__dirname, TARGET, 'assets');
  } catch (err) {
    console.error(err.message);
  }
}

buildPage();