#!/usr/bin/env node
/**
 * Corrige o path de fill em SVGs normalizados para o preenchimento aparecer.
 * Remove o segundo subpath (furo) do path pintável, deixando só o contorno
 * externo — assim o fill é renderizado corretamente em qualquer viewer.
 *
 * Uso:
 *   node scripts/fix-svg-fill.js arquivo.svg
 *   node scripts/fix-svg-fill.js arquivo.svg -o saida.svg
 *   node scripts/fix-svg-fill.js arquivo.svg --fill "#ff0000"
 *   node scripts/fix-svg-fill.js                    # processa public/svg/output/*.svg
 *   node scripts/fix-svg-fill.js pasta/             # processa todos .svg em pasta/
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_INPUT_DIR = path.join(__dirname, "../public/svg/output");
const DEFAULT_OUTPUT_DIR = DEFAULT_INPUT_DIR;

/**
 * Encontra o primeiro <path> que tem fill e stroke="none" (path de área pintável).
 * Retorna { pathTag, attrs, dValue } ou null.
 */
function findFillPath(svg) {
  const pathRegex = /<path\s+([^>]+)\s*\/>/g;
  let m;
  while ((m = pathRegex.exec(svg)) !== null) {
    const attrs = m[1];
    if (!/fill=/.test(attrs) || !/stroke=["']none["']/i.test(attrs)) continue;
    const dMatch = attrs.match(/d=["']([^"']+)["']/);
    if (!dMatch) continue;
    return { pathTag: m[0], attrs, dValue: dMatch[1] };
  }
  return null;
}

/**
 * Remove o segundo subpath do `d` (tudo a partir de " Z M").
 * Deixa só o primeiro contorno fechado, para o fill renderizar.
 */
function stripSecondSubpath(d) {
  const idx = d.indexOf(" Z M");
  if (idx === -1) return d;
  return d.slice(0, idx) + " Z";
}

/**
 * Substitui o atributo d nos attrs (string).
 */
function setDInAttrs(attrs, newD) {
  return attrs.replace(/d=["'][^"']*["']/, `d="${newD}"`);
}

/**
 * Ajusta a cor do fill no atributo do path (string).
 */
function setFillInAttrs(attrs, fillColor) {
  if (!fillColor) return attrs;
  return attrs.replace(/\bfill=["'][^"']*["']/, `fill="${fillColor.replace(/^["']|["']$/g, "")}"`);
}

/**
 * Aplica a correção no SVG e retorna o novo conteúdo.
 */
function fixSvgFill(svgContent, options = {}) {
  const { fillColor } = options;
  const found = findFillPath(svgContent);
  if (!found) {
    return { ok: false, message: "Nenhum path de fill (fill + stroke=none) encontrado." };
  }

  const { pathTag, attrs, dValue } = found;
  const newD = stripSecondSubpath(dValue);
  let newAttrs = setDInAttrs(attrs, newD);
  if (fillColor) newAttrs = setFillInAttrs(newAttrs, fillColor);
  const newPathTag = `<path ${newAttrs} />`;
  const newSvg = svgContent.replace(pathTag, newPathTag);

  return { ok: true, svg: newSvg, changed: newD !== dValue };
}

function processFile(inputPath, outputPath, options) {
  const content = fs.readFileSync(inputPath, "utf8");
  const result = fixSvgFill(content, options);
  if (!result.ok) {
    console.log(`  ⚠ ${path.basename(inputPath)}: ${result.message}`);
    return false;
  }
  fs.writeFileSync(outputPath, result.svg, "utf8");
  console.log(`  ✔ ${path.basename(inputPath)} → ${path.basename(outputPath)}${result.changed ? " (subpath removido)" : ""}`);
  return true;
}

function main() {
  const args = process.argv.slice(2);
  let inputPath = null;
  let outputPath = null;
  let fillColor = null;
  let inputDir = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-o" || args[i] === "--output") {
      outputPath = args[++i];
    } else if (args[i] === "--fill") {
      fillColor = args[++i];
    } else if (args[i] === "--in-place") {
      outputPath = null; // será sobrescrito
    } else if (!args[i].startsWith("-")) {
      if (!inputPath && !inputDir) {
        const p = path.resolve(args[i]);
        if (fs.existsSync(p)) {
          const stat = fs.statSync(p);
          if (stat.isDirectory()) inputDir = p;
          else inputPath = p;
        } else {
          inputPath = p;
        }
      }
    }
  }

  const options = { fillColor };

  if (inputPath) {
    const outDir = outputPath
      ? (path.extname(outputPath) ? path.dirname(outputPath) : outputPath)
      : path.dirname(inputPath);
    const outFile = outputPath && path.extname(outputPath)
      ? path.basename(outputPath)
      : path.basename(inputPath);
    const dest = path.join(outDir, outFile);
    if (!fs.existsSync(inputPath)) {
      console.error("Arquivo não encontrado:", inputPath);
      process.exit(1);
    }
    console.log(`\n▶ ${path.basename(inputPath)}`);
    processFile(inputPath, dest, options);
    return;
  }

  const dir = inputDir || DEFAULT_INPUT_DIR;
  if (!fs.existsSync(dir)) {
    console.error("Pasta não encontrada:", dir);
    console.log("\nUso: node scripts/fix-svg-fill.js [arquivo.svg ou pasta/] [-o saida] [--fill \"#ff0000\"]");
    process.exit(1);
  }

  const outDir = outputPath && !path.extname(outputPath) ? outputPath : dir;
  if (outDir !== dir && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = fs.readdirSync(dir).filter((f) => path.extname(f).toLowerCase() === ".svg");
  if (files.length === 0) {
    console.log("Nenhum .svg em", dir);
    return;
  }

  console.log(`\n▶ Processando ${files.length} SVG(s) em ${path.basename(dir)}`);
  files.forEach((file) => {
    const src = path.join(dir, file);
    const dest = path.join(outDir, file);
    processFile(src, dest, options);
  });
}

main();
