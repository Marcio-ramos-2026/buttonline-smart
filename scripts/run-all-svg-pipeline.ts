#!/usr/bin/env npx tsx
/**
 * Pipeline completo de SVG: roda todos os processos em sequência.
 *
 * 1. prepare (client → output): normaliza + injeta path de fill + remove 2º subpath
 * 2. fix-fill (output): garante que o path de fill tenha só um subpath (correção extra)
 *
 * Entrada: public/svg/client/*.svg
 * Saída:   public/svg/output/*.svg e *.txt (encoded para o banco)
 *
 * Uso:
 *   npm run svg:all
 *   npm run svg:all -- --fill "#000000"
 *   npx tsx scripts/run-all-svg-pipeline.ts [pasta-client/] [-o pasta-output/]
 */

import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

const DEFAULT_CLIENT = path.join(__dirname, "../public/svg/client");
const DEFAULT_OUTPUT = path.join(__dirname, "../public/svg/output");

function main() {
  const args = process.argv.slice(2);
  let clientDir = DEFAULT_CLIENT;
  let outputDir = DEFAULT_OUTPUT;
  const extra: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-o" || args[i] === "--output") {
      outputDir = args[++i] ?? outputDir;
    } else if (!args[i].startsWith("-")) {
      if (i === 0) clientDir = path.resolve(args[i]);
      else extra.push(args[i]);
    } else {
      extra.push(args[i], args[i + 1] ?? "");
      if (args[i] === "--fill") i++;
    }
  }

  const scriptsDir = path.join(__dirname);
  const prepareScript = path.join(scriptsDir, "prepare-svg-for-editor.ts");
  const fixFillScript = path.join(scriptsDir, "fix-svg-fill.js");

  if (!fs.existsSync(clientDir)) {
    console.error("Pasta de entrada não encontrada:", clientDir);
    console.log("\nUso: npm run svg:all   ou   npx tsx scripts/run-all-svg-pipeline.ts [client/] [-o output/] [--fill \"#000\"]");
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(clientDir).filter((f) => path.extname(f).toLowerCase() === ".svg");
  if (files.length === 0) {
    console.log("Nenhum .svg em", clientDir);
    return;
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  Pipeline SVG: prepare → fix-fill (2 processos)");
  console.log("  Entrada:", clientDir);
  console.log("  Saída:  ", outputDir);
  console.log("═══════════════════════════════════════════════════════════\n");

  // Processo 1: prepare (client → output)
  console.log("▶ Processo 1/2: prepare (normaliza + injeta fill + strip 2º subpath)\n");
  const prepareArgs = ["--no-warnings", prepareScript, clientDir, "-o", outputDir, ...extra];
  const r1 = spawnSync("npx", ["tsx", ...prepareArgs], {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
  if (r1.status !== 0) {
    console.error("\n❌ Processo 1 falhou.");
    process.exit(r1.status ?? 1);
  }

  // Processo 2: fix-fill (output in-place)
  console.log("\n▶ Processo 2/2: fix-fill (garante um único subpath no path de fill)\n");
  const fixArgs = [outputDir, ...extra.filter((x) => x !== "--fill" && !x.startsWith("#"))];
  if (extra.includes("--fill")) {
    const fillIdx = extra.indexOf("--fill");
    if (extra[fillIdx + 1]) fixArgs.push("--fill", extra[fillIdx + 1]);
  }
  const r2 = spawnSync("node", [fixFillScript, ...fixArgs], {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
  if (r2.status !== 0) {
    console.error("\n❌ Processo 2 falhou.");
    process.exit(r2.status ?? 1);
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  ✔ Pipeline concluído. Verifique os arquivos em:");
  console.log("    " + outputDir);
  console.log("═══════════════════════════════════════════════════════════\n");
}

main();
