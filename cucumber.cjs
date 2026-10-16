const { createRun } = require('./scripts/report-history');
const path = require('node:path');
const common = {
  paths: ['src/features/*.feature'],
  require: ['src/support/*.js', 'src/steps/*.js'],
  parallel: 1,
  retry: 0
};
// Los comandos npm crean la ejecución y actualizan el índice al finalizar.
// El perfil dry conserva solo la salida de consola.
const isDryProfile = process.argv.includes('dry');
const directory = process.env.QA_REPORT_DIR || (isDryProfile ? null :
  createRun(path.join(__dirname, 'reports'), process.env.BASE_URL || 'https://www.saucedemo.com/').directory);
module.exports = {
  default: {
    ...common,
    format: [
      'progress',
      ...(directory ? [
        ['html', path.join(directory, 'cucumber.html')],
        ['json', path.join(directory, 'cucumber.json')],
        ['junit', path.join(directory, 'cucumber.xml')]
      ] : [])
    ]
  },
  dry: { ...common, dryRun: true, format: ['summary'] }
};

