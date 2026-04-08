const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputFolder = path.join(__dirname, '../public/svg/client');
const outputFolder = path.join(__dirname, '../public/svg/output');

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

fs.readdirSync(inputFolder).forEach((file) => {
  if (path.extname(file) !== '.svg') return;

  const inputPath = path.join(inputFolder, file);
  const baseName = path.basename(file, '.svg');
  const outputSvgPath = path.join(outputFolder, `${baseName}.svg`);
  const outputTxtPath = path.join(outputFolder, `${baseName}.txt`);

  console.log(`\n▶ Processing ${file}`);

  /**
   * INKSCAPE ACTIONS
   * - select everything
   * - convert all objects to path
   * - convert stroke to path
   * - union all paths
   * - remove stroke
   * - apply solid fill
   * - fit canvas
   */
  const inkscapeCmd = [
    'inkscape',
    `"${inputPath}"`,
    '--actions="edit-select-all;',
    'object-to-path;',
    'object-stroke-to-path;',
    'path-union;',
    'object-set-attribute:style,stroke:none;',
    'object-set-attribute:style,fill:#000000;',
    'fit-canvas-to-selection"',
    '--export-type=svg',
    `--export-filename="${outputSvgPath}"`
  ].join(' ');

  try {
    execSync(inkscapeCmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Inkscape failed for ${file}`);
    return;
  }

  /**
   * ENCODE SVG FOR DATABASE
   */
  try {
    const svgContent = fs.readFileSync(outputSvgPath, 'utf8');

    const encoded = svgContent
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '')
      .replace(/\r/g, '');

    fs.writeFileSync(outputTxtPath, encoded, 'utf8');

    console.log(`✔ SVG + TXT generated for ${file}`);
  } catch (err) {
    console.error(`❌ Encoding failed for ${file}`);
  }
});
