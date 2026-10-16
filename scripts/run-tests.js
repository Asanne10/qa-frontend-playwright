const path = require('node:path');
const { spawn } = require('node:child_process');
const { createRun, saveRun, summarize, updateIndex } = require('./report-history');

const project = path.resolve(__dirname, '..');
const root = path.join(project, 'reports');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const { directory, run } = createRun(root, process.env.BASE_URL || 'https://www.saucedemo.com/');
updateIndex(root);
console.log(`Reporte de esta ejecución: ${path.join(directory, 'cucumber.html')}`);
const child = spawn(process.execPath, [path.join(project, 'node_modules/@cucumber/cucumber/bin/cucumber.js'), ...args], {
  cwd: project, stdio: 'inherit', env: { ...process.env, QA_REPORT_DIR: directory }
});
let completed = false;
function finish(code, error) {
  if (completed) return;
  completed = true;
  const exitCode = code ?? 1;
  Object.assign(run, summarize(directory, exitCode, dryRun), { finishedAt: new Date().toISOString(), exitCode });
  if (error) run.error = error.message;
  saveRun(directory, run);
  updateIndex(root);
  console.log(`Historial: ${path.join(root, 'index.html')}`);
  process.exitCode = exitCode;
}
child.on('error', error => finish(1, error));
child.on('exit', code => finish(code));
// Un cierre forzado del proceso completo conserva la carpeta como EN CURSO.
