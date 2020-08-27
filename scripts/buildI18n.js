const fs = require('fs');
const path = require('path');
const findPackages = require('./findPackages');

const packages = findPackages();

console.log(packages);

for (let a of packages) {
  console.log(path.resolve('../packags', a.dir, 'src/i18n/en.json'));

  const i18nFolderExists = fs.existsSync(path.resolve('../packags', a.dir, 'src/i18n/en.json'));

  console.log(a.dir, i18nFolderExists);
}
