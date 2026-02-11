/**
 * Normalização de SVG para o Buttonline Smart
 *
 * Garante que todo SVG tenha:
 * - Contorno (traços originais preservados: linha contínua, pontilhada, etc.)
 * - Área pintável (um path com fill, derivado dos traços)
 *
 * Fluxo:
 * 1. Inkscape: gera um path único com fill a partir dos strokes (stroke-to-path + union).
 * 2. Mescla: injeta esse path de fill no SVG original, mantendo todos os elementos de traço.
 * 3. Limpeza: viewBox coerente, remove metadados (Inkscape/Sodipodi), opcionalmente assa transform do root.
 *
 * Uso:
 *   node scripts/normalize-svg.js [arquivo.svg]
 *   node scripts/normalize-svg.js                    # processa public/svg/client/*.svg
 *
 * Requer Inkscape instalado (para gerar o path de fill). Sem Inkscape, só faz limpeza de metadados/viewBox.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const INPUT_FOLDER = path.join(__dirname, '../public/svg/client');
const OUTPUT_FOLDER = path.join(__dirname, '../public/svg/output');

const DEFAULT_FILL_COLOR = '#000000';

function getInkscapePath() {
  const candidates = ['inkscape', '/usr/bin/inkscape', '/opt/homebrew/bin/inkscape'];
  for (const c of candidates) {
    try {
      execSync(`"${c}" --version`, { stdio: 'ignore' });
      return c;
    } catch (_) {
      // continue
    }
  }
  return null;
}

/**
 * Extrai o atributo viewBox do SVG (string "minX minY width height").
 */
function extractViewBox(svgString) {
  const m = svgString.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  return m ? m[1].trim() : null;
}

/**
 * Extrai o primeiro <path d="..."> do SVG (conteúdo do atributo d).
 */
function extractFirstPathD(svgString) {
  const m = svgString.match(/<path[^>]*\s+d\s*=\s*["']([^"']+)["']/i);
  return m ? m[1].trim() : null;
}

/**
 * Remove namespaces e atributos de editor (Inkscape, Sodipodi, etc.).
 */
function stripEditorMetadata(svgString) {
  return svgString
    .replace(/\s+xmlns:inkscape="[^"]*"/gi, '')
    .replace(/\s+xmlns:sodipodi="[^"]*"/gi, '')
    .replace(/\s+inkscape:[^\s=]+="[^"]*"/gi, '')
    .replace(/\s+sodipodi:[^\s=]+="[^"]*"/gi, '')
    .replace(/\s+xmlns:svg="[^"]*"/gi, '')
    .replace(/\s*<!--[^]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Garante que o elemento <svg> tenha viewBox correto (evita valores gigantes como 23592).
 * Se o viewBox já estiver coerente, não altera.
 */
function ensureViewBox(svgString, viewBoxFromOriginal) {
  if (!viewBoxFromOriginal) return svgString;
  const parts = viewBoxFromOriginal.split(/\s+/).map((p) => p.trim());
  if (parts.length !== 4) return svgString;
  const [, , w, h] = parts;
  const width = parseFloat(w);
  const height = parseFloat(h);
  if (width > 10000 || height > 10000) {
    console.warn('  ⚠ viewBox com valores muito altos; use o viewBox do SVG original do cliente.');
  }
  return svgString.replace(/viewBox\s*=\s*["'][^"']+["']/i, `viewBox="${viewBoxFromOriginal}"`);
}

/**
 * Gera um SVG só com o path de fill usando Inkscape (stroke-to-path + union + fill).
 * Retorna o conteúdo do arquivo exportado ou null se falhar.
 */
function generateFillPathWithInkscape(inputSvgPath, inkscapeCmd, tmpDir) {
  const fillOnlyPath = path.join(tmpDir, 'fill-only.svg');
  const actions = [
    'edit-select-all',
    'object-to-path',
    'object-stroke-to-path',
    'path-union',
    'object-set-attribute:style,stroke:none',
    `object-set-attribute:style,fill:${DEFAULT_FILL_COLOR}`,
  ].join(';');
  const cmd = `"${inkscapeCmd}" "${inputSvgPath}" --actions="${actions}" --export-type=svg --export-filename="${fillOnlyPath}"`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    if (fs.existsSync(fillOnlyPath)) {
      return fs.readFileSync(fillOnlyPath, 'utf8');
    }
  } catch (e) {
    console.error('  Inkscape error:', e.message || e);
  }
  return null;
}

/**
 * Injeta um path de fill no SVG original (após <defs> ou após <svg>).
 * O path é inserido no início do conteúdo para que os traços desenhados por cima.
 */
function injectFillPath(originalSvg, pathD, fillColor = DEFAULT_FILL_COLOR) {
  const pathTag = `<path fill="${fillColor}" stroke="none" d="${pathD}"/>`;
  if (/<\/defs\s*>/i.test(originalSvg)) {
    return originalSvg.replace(/(<\/defs\s*>)/i, `$1\n  ${pathTag}\n  `);
  }
  return originalSvg.replace(/(<svg[^>]*>)/i, `$1\n  ${pathTag}\n  `);
}

/**
 * Remove transform do elemento <svg> root (opcional; evita problemas no Fabric).
 * Por ora apenas detectamos; assar transform nas coordenadas exigiria lib de geometria.
 */
function warnRootTransform(svgString) {
  if (/<svg[^>]*\stransform\s*=/i.test(svgString)) {
    console.warn('  ⚠ SVG tem transform no root; considere assar no editor (ex.: Inkscape) antes.');
  }
}

/**
 * Normaliza um SVG: contorno preservado + path de fill injetado.
 * - Se Inkscape estiver disponível: gera fill e mescla.
 * - Caso contrário: só limpa metadados e viewBox; não adiciona fill.
 */
function normalizeSvg(originalSvgString, options = {}) {
  const { stripMetadata = true, ensureViewBoxFromOriginal = true } = options;
  const viewBoxOriginal = extractViewBox(originalSvgString);
  warnRootTransform(originalSvgString);

  let result = originalSvgString;
  const inkscapeCmd = getInkscapePath();

  if (inkscapeCmd) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'normalize-svg-'));
    const inputPath = path.join(tmpDir, 'input.svg');
    fs.writeFileSync(inputPath, originalSvgString, 'utf8');
    const fillOnlySvg = generateFillPathWithInkscape(inputPath, inkscapeCmd, tmpDir);
    try {
      fs.rmSync(tmpDir, { recursive: true });
    } catch (_) {}

    if (fillOnlySvg) {
      const pathD = extractFirstPathD(fillOnlySvg);
      if (pathD) {
        result = injectFillPath(result, pathD, options.fillColor || DEFAULT_FILL_COLOR);
      }
    }
  } else {
    console.warn('  Inkscape não encontrado; apenas limpeza de metadados (sem adicionar fill).');
  }

  if (stripMetadata) {
    result = stripEditorMetadata(result);
  }
  if (ensureViewBoxFromOriginal && viewBoxOriginal) {
    result = ensureViewBox(result, viewBoxOriginal);
  }
  return result;
}

/**
 * Encode para colar no JSON do banco (escape para string em config.objects.*.svg).
 */
function encodeForDb(svgString) {
  return svgString
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '')
    .replace(/\r/g, '');
}

function processFile(inputPath, outputDir, outputEncodedTxt = true) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const original = fs.readFileSync(inputPath, 'utf8');
  console.log(`\n▶ ${path.basename(inputPath)}`);

  const normalized = normalizeSvg(original);
  const outSvgPath = path.join(outputDir, `${baseName}.svg`);
  fs.writeFileSync(outSvgPath, normalized, 'utf8');
  console.log(`  ✔ ${outSvgPath}`);

  if (outputEncodedTxt) {
    const outTxtPath = path.join(outputDir, `${baseName}.txt`);
    fs.writeFileSync(outTxtPath, encodeForDb(normalized), 'utf8');
    console.log(`  ✔ ${outTxtPath} (encoded for DB)`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const singleFile = args[0];

  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
  }

  if (singleFile) {
    const inputPath = path.resolve(singleFile);
    if (!fs.existsSync(inputPath)) {
      console.error('Arquivo não encontrado:', inputPath);
      process.exit(1);
    }
    processFile(inputPath, OUTPUT_FOLDER);
    return;
  }

  if (!fs.existsSync(INPUT_FOLDER)) {
    console.error('Pasta de entrada não encontrada:', INPUT_FOLDER);
    console.log('Uso: node scripts/normalize-svg.js [arquivo.svg]');
    process.exit(1);
  }

  const files = fs.readdirSync(INPUT_FOLDER).filter((f) => path.extname(f).toLowerCase() === '.svg');
  if (files.length === 0) {
    console.log('Nenhum .svg em', INPUT_FOLDER);
    return;
  }

  files.forEach((file) => {
    processFile(path.join(INPUT_FOLDER, file), OUTPUT_FOLDER);
  });
}

if (require.main === module) {
  main();
} else {
  module.exports = { normalizeSvg, encodeForDb, extractViewBox, extractFirstPathD };
}
