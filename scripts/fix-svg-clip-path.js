const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('svgson');
const outline = require('svg-path-outline');

const inputFolder = path.join(__dirname, '../public/conversion/old-svg');
const outputFolder = path.join(__dirname, '../public/conversion/new-svg');

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

fs.readdirSync(inputFolder).forEach(async file => {
  if (!file.endsWith('.svg')) return;

  console.log(`\n▶ Processing ${file}`);

  const inputPath = path.join(inputFolder, file);
  const outputSvgPath = path.join(outputFolder, file);
  const outputTxtPath = path.join(outputFolder, file.replace('.svg', '.txt'));

  const svg = fs.readFileSync(inputPath, 'utf8');
  const ast = await parse(svg);

  const newChildren = [];

  function walk(node) {
    if (node.name === 'polyline' || node.name === 'path' || node.name === 'line') {
      let d = '';

      if (node.name === 'polyline') {
        const points = node.attributes.points.trim().split(/\s+/);
        d = 'M ' + points.join(' L ');
      }

      if (node.name === 'line') {
        const { x1, y1, x2, y2 } = node.attributes;
        d = `M ${x1} ${y1} L ${x2} ${y2}`;
      }

      if (node.name === 'path') {
        d = node.attributes.d;
      }

      const outlined = outline(d, {
        strokeWidth: 8,      // controla a espessura final
        join: 'round',
        cap: 'round'
      });

      newChildren.push({
        name: 'path',
        type: 'element',
        attributes: {
          d: outlined,
          fill: '#ff0000'
        },
        children: []
      });
    }

    node.children?.forEach(walk);
  }

  walk(ast);

  ast.children = newChildren;

  const finalSvg = stringify(ast);
  fs.writeFileSync(outputSvgPath, finalSvg);

  const encoded = finalSvg
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '');

  fs.writeFileSync(outputTxtPath, encoded);

  console.log(`✔ SVG + TXT generated`);
});
