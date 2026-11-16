// Junta dados.json + plugin/codigo.js em um plugin pronto (pasta de saída com manifest.json e code.js).
// Uso: node aprovacao/gerar-figma/montar.js <pasta-de-saida>
const fs = require('fs');
const path = require('path');
const out = path.resolve(process.argv[2] || path.join(__dirname, '.saida', 'plugin'));
fs.mkdirSync(out, { recursive: true });
const dados = fs.readFileSync(path.join(__dirname, '.saida', 'dados.json'), 'utf8');
const codigo = fs.readFileSync(path.join(__dirname, 'plugin', 'codigo.js'), 'utf8');
fs.writeFileSync(path.join(out, 'code.js'), 'const DADOS = ' + dados + ';\n' + codigo);
fs.copyFileSync(path.join(__dirname, 'plugin', 'manifest.json'), path.join(out, 'manifest.json'));
console.log('plugin em', out, (fs.statSync(path.join(out, 'code.js')).size / 1e6).toFixed(1) + ' MB');
