/**
 * Um único comando: SVG do cliente → SVG pronto para o Fabric (pintável).
 * Lê todos os .svg em public/svg/client, normaliza + corrige fill, grava em public/svg/output
 * com mesmo-nome.svg e mesmo-nome.txt (encoded para o banco).
 *
 * Resolve por estilos de SVG (polyline, line, path) — qualquer SVG que use esses elementos
 * é processado da mesma forma. O normalizador escolhe union ou convex hull conforme o resultado.
 *
 * Uso:
 *   npm run svg:prepare     # client/ → output/ (mesmo nome .svg + .txt)
 *   npm run svg:prepare -- --fill "#000000"
 *   npx tsx scripts/prepare-svg-for-editor.ts pasta/ -o saida/   # pastas customizadas
 */

import fs from "fs";
import path from "path";
import { prepareSvgForEditor, encodeForDb } from "../src/lib/svg-normalizer";

const DEFAULT_INPUT_DIR = path.join(__dirname, "../public/svg/client");
const DEFAULT_OUTPUT_DIR = path.join(__dirname, "../public/svg/output");

function processFile(
  inputPath: string,
  outputPath: string,
  options: { fillColor?: string; writeEncodedTxt?: boolean } = {}
) {
  const content = fs.readFileSync(inputPath, "utf8");
  const { fillColor = "transparent", writeEncodedTxt = true } = options;

  const prepared = prepareSvgForEditor(content, { fillColor });
  fs.writeFileSync(outputPath, prepared, "utf8");
  console.log(`  ✔ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);

  if (writeEncodedTxt) {
    const outTxt = outputPath.replace(/\.svg$/i, ".txt");
    fs.writeFileSync(outTxt, encodeForDb(prepared), "utf8");
    console.log(`  ✔ ${path.basename(outTxt)} (encoded for DB)`);
  }
}

function main() {
  const args = process.argv.slice(2);
  let inputPath: string | null = null;
  let inputDir: string | null = null;
  let outputPath: string | null = null;
  let fillColor = "transparent";
  let noTxt = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-o" || args[i] === "--output") {
      outputPath = args[++i] ?? null;
    } else if (args[i] === "--fill") {
      fillColor = args[++i] ?? "transparent";
    } else if (args[i] === "--no-txt") {
      noTxt = true;
    } else if (!args[i].startsWith("-")) {
      const p = path.resolve(args[i]);
      if (!inputPath && !inputDir) {
        if (fs.existsSync(p)) {
          if (fs.statSync(p).isDirectory()) inputDir = p;
          else inputPath = p;
        } else {
          inputPath = p;
        }
      }
    }
  }

  const options = { fillColor, writeEncodedTxt: !noTxt };

  if (inputPath) {
    const outDir = outputPath
      ? (path.extname(outputPath) ? path.dirname(outputPath) : outputPath)
      : DEFAULT_OUTPUT_DIR;
    const outFile =
      outputPath && path.extname(outputPath) ? path.basename(outputPath) : path.basename(inputPath);
    const dest = path.join(outDir, outFile.endsWith(".svg") ? outFile : `${outFile}.svg`);
    if (!fs.existsSync(inputPath)) {
      console.error("Arquivo não encontrado:", inputPath);
      process.exit(1);
    }
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    console.log(`\n▶ ${path.basename(inputPath)}`);
    processFile(inputPath, dest, options);
    return;
  }

  const dir = inputDir ?? DEFAULT_INPUT_DIR;
  if (!fs.existsSync(dir)) {
    console.error("Pasta não encontrada:", dir);
    console.log("\nUso: npm run svg:prepare   (lê public/svg/client → grava public/svg/output)");
    console.log("      ou: npx tsx scripts/prepare-svg-for-editor.ts [pasta/] [-o saida/] [--fill \"#000000\"]");
    process.exit(1);
  }

  const outDir = outputPath && !path.extname(outputPath) ? outputPath : DEFAULT_OUTPUT_DIR;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = fs.readdirSync(dir).filter((f) => path.extname(f).toLowerCase() === ".svg");
  if (files.length === 0) {
    console.log("Nenhum .svg em", dir);
    return;
  }

  console.log(`\n▶ Processando ${files.length} SVG(s) em ${path.basename(dir)}`);
  files.forEach((file) => {
    processFile(path.join(dir, file), path.join(outDir, file), options);
  });
}

main();
