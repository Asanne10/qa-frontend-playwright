const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const zone = 'America/Lima';
function createRun(root, baseUrl) {
  const now = new Date();
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(now).map(part => [part.type, part.value]));
  const id = `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}-${parts.second}-${String(now.getUTCMilliseconds()).padStart(3, '0')}_${randomUUID().slice(0, 8)}`;
  const directory = path.join(root, id);
  fs.mkdirSync(directory, { recursive: true });
  const run = { id, startedAt: now.toISOString(), timeZone: zone, baseUrl, status: 'EN CURSO' };
  saveRun(directory, run);
  return { directory, run };
}
function saveRun(directory, run) {
  fs.writeFileSync(path.join(directory, 'execution.json'), JSON.stringify(run, null, 2));
}
function summarize(directory, exitCode, dryRun) {
  const counts = { passed: 0, failed: 0, skipped: 0 };
  try {
    const features = JSON.parse(fs.readFileSync(path.join(directory, 'cucumber.json'), 'utf8'));
    for (const scenario of features.flatMap(feature => feature.elements || [])) {
      if (scenario.type !== 'scenario') continue;
      const statuses = (scenario.steps || []).map(step => step.result?.status);
      (scenario.before || []).concat(scenario.after || []).forEach(hook => statuses.push(hook.result?.status));
      if (statuses.some(status => ['failed', 'undefined', 'ambiguous', 'pending'].includes(status))) counts.failed++;
      else if (statuses.length && statuses.every(status => status === 'passed')) counts.passed++;
      else counts.skipped++;
    }
  } catch {
    return { counts, status: 'ERROR DE EJECUCIÓN' };
  }
  const total = counts.passed + counts.failed + counts.skipped;
  const status = dryRun ? 'SIN EJECUTAR (DRY RUN)' : exitCode !== 0 ? 'FALLIDA' : !total ? 'SIN CASOS' : counts.skipped ? 'INCOMPLETA' : 'APROBADA';
  return { counts, status };
}
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
function updateIndex(root) {
  const runs = fs.readdirSync(root, { withFileTypes: true }).filter(item => item.isDirectory()).flatMap(item => {
    try { return [JSON.parse(fs.readFileSync(path.join(root, item.name, 'execution.json'), 'utf8'))]; }
    catch { return []; }
  }).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const rows = runs.map(run => {
    const date = new Intl.DateTimeFormat('es-PE', { timeZone: zone, dateStyle: 'short', timeStyle: 'medium' }).format(new Date(run.startedAt));
    const reportExists = fs.existsSync(path.join(root, run.id, 'cucumber.html'));
    return `<tr><td>${escapeHtml(date)}</td><td><span class="badge">${escapeHtml(run.status)}</span></td><td>${escapeHtml(run.baseUrl)}</td><td>${run.counts?.passed ?? '—'}</td><td>${run.counts?.failed ?? '—'}</td><td>${run.counts?.skipped ?? '—'}</td><td>${reportExists ? `<a href="${encodeURIComponent(run.id)}/cucumber.html">Ver reporte</a>` : 'Sin HTML'} · <a href="${encodeURIComponent(run.id)}/execution.json">Detalle</a></td></tr>`;
  }).join('');
  fs.writeFileSync(path.join(root, 'index.html'), `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bitácora QA · Sauce Demo</title><style>body{font:16px system-ui;background:#f4f6fa;color:#172a3a;margin:0;padding:36px}main{max-width:1300px;margin:auto}h1{margin-bottom:8px}p{color:#4b6074}.table{overflow:auto;background:white;border-radius:12px;border:1px solid #dde4ec}table{width:100%;border-collapse:collapse;text-align:left}th,td{padding:16px;border-bottom:1px solid #e5eaf0}th{background:#172a3a;color:white;font-size:13px}a{color:#005c99;white-space:nowrap}.badge{font-size:12px;font-weight:700}footer{margin-top:20px;color:#4b6074}</style><main><p>SAUCE DEMO / PLAYWRIGHT + CUCUMBER</p><h1>Bitácora de ejecuciones</h1><p>Historial de pruebas · Hora de Lima (UTC−05:00) · ${runs.length} ejecuciones</p><div class="table"><table><thead><tr><th>Inicio</th><th>Estado</th><th>Ambiente</th><th>Aprobados</th><th>Fallidos</th><th>Omitidos</th><th>Evidencia</th></tr></thead><tbody>${rows}</tbody></table></div><footer>El ambiente identifica dónde se ejecutó cada prueba. Una ejecución local no acredita el dominio remoto. Actualiza esta página después de ejecutar.</footer></main></html>`);
}
module.exports = { createRun, saveRun, summarize, updateIndex };
