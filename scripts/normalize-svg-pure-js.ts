/**
 * Normalização de SVG em JavaScript puro (sem Inkscape).
 * Use este script quando não tiver Inkscape (ex.: CI, Vercel) ou para o mesmo resultado em qualquer ambiente.
 *
 * Uso: npx tsx scripts/normalize-svg-pure-js.ts [arquivo.svg]
 *      npx tsx scripts/normalize-svg-pure-js.ts   # processa public/svg/client/*.svg
 */

import fs from "fs";
import path from "path";
import { normalizeSvg, encodeForDb } from "../src/lib/svg-normalizer";

const INPUT_FOLDER = path.join(__dirname, "../public/svg/client");
const OUTPUT_FOLDER = path.join(__dirname, "../public/svg/output");

function processFile(inputPath: string, outputDir: string, outputEncodedTxt = true) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const original = fs.readFileSync(inputPath, "utf8");
  console.log(`\n▶ ${path.basename(inputPath)} (pure JS)`);

  const normalized = normalizeSvg(original);
  const outSvgPath = path.join(outputDir, `${baseName}.svg`);
  fs.writeFileSync(outSvgPath, normalized, "utf8");
  console.log(`  ✔ ${outSvgPath}`);

  if (outputEncodedTxt) {
    const outTxtPath = path.join(outputDir, `${baseName}.txt`);
    fs.writeFileSync(outTxtPath, encodeForDb(normalized), "utf8");
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
      console.error("Arquivo não encontrado:", inputPath);
      process.exit(1);
    }
    processFile(inputPath, OUTPUT_FOLDER);
    return;
  }

  if (!fs.existsSync(INPUT_FOLDER)) {
    console.error("Pasta de entrada não encontrada:", INPUT_FOLDER);
    console.log("Uso: npx tsx scripts/normalize-svg-pure-js.ts [arquivo.svg]");
    process.exit(1);
  }

  const files = fs.readdirSync(INPUT_FOLDER).filter((f) => path.extname(f).toLowerCase() === ".svg");
  if (files.length === 0) {
    console.log("Nenhum .svg em", INPUT_FOLDER);
    return;
  }

  files.forEach((file) => {
    processFile(path.join(INPUT_FOLDER, file), OUTPUT_FOLDER);
  });
}

main();
