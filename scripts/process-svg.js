const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '../public/conversion/inkscape-svg');
const OUTPUT = path.join(__dirname, '../public/conversion/converted-svg');

if (!fs.existsSync(OUTPUT)) {
  fs.mkdirSync(OUTPUT, { recursive: true });
}

for (const file of fs.readdirSync(INPUT)) {
  if (!file.endsWith('.svg')) continue;

  console.log(`▶ Processing ${file}`);

  const svgPath = path.join(INPUT, file);
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // ENCODE SEM MODIFICAR O SVG
  const encoded = svgContent
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, '');

  const outTxt = path.join(
    OUTPUT,
    file.replace('.svg', '.txt')
  );

  fs.writeFileSync(outTxt, encoded, 'utf8');

  console.log(`✔ Encoded TXT generated: ${path.basename(outTxt)}`);
}
