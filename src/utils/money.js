// Se trabaja en centavos para evitar sumas con decimales binarios.
function toCents(text) {
  const match = text.match(/\$(\d+)\.(\d{2})(?!\d)/);
  if (!match) throw new Error(`Importe no reconocido: ${text}`);
  return Number(match[1]) * 100 + Number(match[2]);
}
module.exports = { toCents };
