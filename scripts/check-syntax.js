const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');
function check(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) check(path);
    else if (path.endsWith('.js')) execFileSync(process.execPath, ['--check', path], { stdio: 'inherit' });
  }
}
check('src');
check('scripts');
execFileSync(process.execPath, ['--check', 'cucumber.cjs'], { stdio: 'inherit' });
console.log('Sintaxis JavaScript correcta.');
