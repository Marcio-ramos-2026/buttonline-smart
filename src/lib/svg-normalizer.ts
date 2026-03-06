/**
 * Normalização de SVG em JavaScript puro (sem Inkscape).
 * Roda na Vercel, no browser ou em Node.
 *
 * Resolve por estilos de SVG (tipos de elemento), não por arquivo específico:
 * - Extrai geometria de <polyline>, <line> e <path> (qualquer classe/atributo).
 * - Union dos strokes → se um polígono dominante: usa seu contorno; se muitos polígonos
 *   pequenos (ex.: desenho pontilhado): usa convex hull dos pontos como área de fill.
 * Novos elementos (ex.: <rect>, <circle>) podem ser suportados com novas funções extract*.
 */

import polygonClipping from "polygon-clipping";
import { pointsOnPath } from "points-on-path";

const DEFAULT_STROKE_WIDTH = 0.72;

type Ring = [number, number][];
type Polygon = Ring[];

/**
 * Extrai stroke-width do SVG (de estilos inline ou de classes em <style>).
 */
function parseStrokeWidth(svgString: string): number {
  const pxMatch = svgString.match(/stroke-width:\s*([\d.]+)px/i);
  if (pxMatch) return parseFloat(pxMatch[1]);
  const numMatch = svgString.match(/stroke-width:\s*([\d.]+)/i);
  if (numMatch) return parseFloat(numMatch[1]);
  return DEFAULT_STROKE_WIDTH;
}

/**
 * Extrai viewBox do SVG.
 */
export function extractViewBox(svgString: string): string | null {
  const m = svgString.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  return m ? m[1].trim() : null;
}

/**
 * Parse polylines: retorna array de arrays de pontos [x,y][].
 */
function extractPolylines(svgString: string): Ring[] {
  const rings: Ring[] = [];
  const regex = /<polyline[^>]*\s+points\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(svgString)) !== null) {
    const points = m[1]
      .trim()
      .split(/[\s,]+/)
      .map((s) => parseFloat(s));
    const ring: Ring = [];
    for (let i = 0; i < points.length; i += 2) {
      if (i + 1 < points.length) ring.push([points[i], points[i + 1]]);
    }
    if (ring.length >= 2) rings.push(ring);
  }
  return rings;
}

/**
 * Extrai segmentos de <line x1="" y1="" x2="" y2=""> como anéis de 2 pontos.
 */
function extractLines(svgString: string): Ring[] {
  const rings: Ring[] = [];
  const lineTagRegex = /<line\s+[^>]+>/gi;
  let m: RegExpExecArray | null;
  while ((m = lineTagRegex.exec(svgString)) !== null) {
    const tag = m[0];
    const x1Match = tag.match(/x1\s*=\s*["']([\d.-]+)["']/i);
    const y1Match = tag.match(/y1\s*=\s*["']([\d.-]+)["']/i);
    const x2Match = tag.match(/x2\s*=\s*["']([\d.-]+)["']/i);
    const y2Match = tag.match(/y2\s*=\s*["']([\d.-]+)["']/i);
    if (x1Match && y1Match && x2Match && y2Match) {
      rings.push([
        [parseFloat(x1Match[1]), parseFloat(y1Match[1])],
        [parseFloat(x2Match[1]), parseFloat(y2Match[1])],
      ]);
    }
  }
  return rings;
}

/**
 * Parse paths com atributo d; retorna array de arrays de pontos (flatten de pointsOnPath).
 */
function extractPathPoints(svgString: string): Ring[] {
  const rings: Ring[] = [];
  const regex = /<path[^>]*\s+d\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(svgString)) !== null) {
    const d = m[1].trim();
    if (!d) continue;
    try {
      const sets = pointsOnPath(d, 2, 0);
      for (const set of sets) {
        if (Array.isArray(set) && set.length >= 2) {
          rings.push(set as Ring);
        }
      }
    } catch (_) {
      // path inválido ou não suportado; ignorar
    }
  }
  return rings;
}

/**
 * Dado um segmento A->B, retorna um polígono (anel) representando o segmento com largura w.
 */
function segmentToPolygon(ax: number, ay: number, bx: number, by: number, halfW: number): Ring {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  if (len < 1e-10) return [[ax, ay], [ax, ay], [ax, ay], [ax, ay]];
  const nx = (-dy / len) * halfW;
  const ny = (dx / len) * halfW;
  return [
    [ax + nx, ay + ny],
    [ax - nx, ay - ny],
    [bx - nx, by - ny],
    [bx + nx, by + ny],
  ];
}

/**
 * Converte uma sequência de pontos (polyline/path) em um polígono "expandido" pelo stroke.
 * Cria um retângulo por segmento e une todos (union).
 */
function pointsToStrokePolygons(points: Ring, halfStroke: number): Polygon[] {
  const polygons: Polygon[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[i + 1];
    const ring = segmentToPolygon(ax, ay, bx, by, halfStroke);
    polygons.push([ring]);
  }
  return polygons;
}

/**
 * Área aproximada de um anel (signed, para ordenação).
 */
function ringArea(ring: Ring): number {
  let area = 0;
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += ring[i][0] * ring[j][1];
    area -= ring[j][0] * ring[i][1];
  }
  return Math.abs(area) / 2;
}

/**
 * Convex hull (Graham scan) de um conjunto de pontos. Retorna um anel fechado.
 * Usado como fallback para desenhos pontilhados onde o union gera muitos polígonos pequenos.
 */
function convexHull(points: [number, number][]): Ring {
  const n = points.length;
  if (n < 3) return points.length >= 2 ? [...points] : [];
  const pts = [...points];
  const idx = pts.reduce((best, p, i) => {
    if (p[1] < pts[best][1]) return i;
    if (p[1] === pts[best][1] && p[0] < pts[best][0]) return i;
    return best;
  }, 0);
  const start = pts[idx];
  pts.splice(idx, 1);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  pts.sort((a, b) => {
    const c = cross(start, a, b);
    if (Math.abs(c) < 1e-10) return Math.hypot(a[0] - start[0], a[1] - start[1]) - Math.hypot(b[0] - start[0], b[1] - start[1]);
    return c > 0 ? -1 : 1; // anti-horário: a antes de b quando cross > 0
  });
  const hull: [number, number][] = [start];
  for (const p of pts) {
    while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0)
      hull.pop();
    hull.push(p);
  }
  return hull;
}

/**
 * Converte um único anel em string path d (um subpath: M...L...Z).
 * Usado para injetar só o contorno externo e evitar que viewers quebrem o fill com múltiplos subpaths.
 */
function singleRingToPathD(ring: Ring): string {
  if (ring.length < 3) return "";
  const start = ring[0];
  const parts = [`M${start[0]},${start[1]}`];
  for (let i = 1; i < ring.length; i++) {
    parts.push(`L${ring[i][0]},${ring[i][1]}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

/**
 * Converte um MultiPolygon (saída do polygon-clipping) em string path d.
 * Ordena anéis por área decrescente: o maior (contorno externo) primeiro,
 * depois os furos — assim fill-rule="evenodd" preenche corretamente.
 * Só inclui anéis com 3+ pontos.
 */
function multipolygonToPathD(multi: Polygon[]): string {
  const parts: string[] = [];
  for (const polygon of multi) {
    const validRings = polygon.filter((ring) => ring.length >= 3);
    const sorted = [...validRings].sort((a, b) => ringArea(b) - ringArea(a)); // maior primeiro
    for (const ring of sorted) {
      parts.push(singleRingToPathD(ring));
    }
  }
  return parts.join(" ");
}

/**
 * Remove metadados de editor (Inkscape, Sodipodi, comentários).
 */
function stripEditorMetadata(svgString: string): string {
  return svgString
    .replace(/\s+xmlns:inkscape="[^"]*"/gi, "")
    .replace(/\s+xmlns:sodipodi="[^"]*"/gi, "")
    .replace(/\s+inkscape:[^\s=]+="[^"]*"/gi, "")
    .replace(/\s+sodipodi:[^\s=]+="[^"]*"/gi, "")
    .replace(/\s+xmlns:svg="[^"]*"/gi, "")
    .replace(/\s*<!--[^]*?-->/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Garante viewBox coerente (evita valores gigantes).
 */
function ensureViewBox(svgString: string, viewBoxFromOriginal: string | null): string {
  if (!viewBoxFromOriginal) return svgString;
  return svgString.replace(
    /viewBox\s*=\s*["'][^"']+["']/i,
    `viewBox="${viewBoxFromOriginal}"`
  );
}

/** Id do path de área pintável injetado pela normalização. Usado no Fabric para identificar e manipular. */
export const CARDENAS_FILL_AREA_ID = "cardenas-fill-area";

/** Id do clipPath injetado pela normalização (mesmo contorno que a área de fill). */
export const CARDENAS_CLIP_PATH_ID = "cardenas-clip";

/**
 * Extrai o atributo "d" do primeiro <path> dentro de um <clipPath> no SVG.
 * Se o SVG já define clipPath, esse path é o contorno correto para clipping.
 *
 * Para o editor reconhecer e usar o clip: coloque um <clipPath> no SVG com um
 * <path d="..."> que descreva o contorno da área (ex.: o mesmo contorno do desenho).
 * Exemplo:
 *   <svg ...>
 *     <defs>
 *       <clipPath id="cardenas-clip">
 *         <path d="M0,0 L100,0 L100,100 L0,100 Z"/>
 *       </clipPath>
 *     </defs>
 *     ... resto do desenho ...
 *   </svg>
 *
 * @returns string d ou null se não houver clipPath com path
 */
export function extractClipPathD(svgString: string): string | null {
  const clipPathMatch = svgString.match(/<clipPath[\s\S]*?<\/clipPath>/i);
  if (!clipPathMatch) return null;
  const block = clipPathMatch[0];
  const dMatch = block.match(/<path[^>]*\s+d\s*=\s*["']([^"']+)["']/i) ?? block.match(/d\s*=\s*["']([^"']+)["']/i);
  return dMatch ? dMatch[1].trim().replace(/\s+/g, " ") : null;
}

/**
 * Injeta um <clipPath> no SVG com o path informado (mesmo contorno da área de fill).
 * Coloca dentro de <defs>; cria <defs> se não existir.
 */
function injectClipPath(originalSvg: string, pathD: string): string {
  const clipBlock = `<clipPath id="${CARDENAS_CLIP_PATH_ID}"><path d="${pathD}"/></clipPath>`;
  if (/<defs[\s\S]*?<\/defs\s*>/i.test(originalSvg)) {
    return originalSvg.replace(/(<\/defs\s*>)/i, `\n  ${clipBlock}\n$1`);
  }
  const defsBlock = `<defs>\n  ${clipBlock}\n</defs>`;
  return originalSvg.replace(/(<svg[^>]*>)/i, `$1\n  ${defsBlock}\n  `);
}

/**
 * Injeta um path de fill no SVG (após </defs> ou após <svg>).
 * fill-rule="evenodd" = exterior preenchido, furos vazios, sem depender do sentido dos anéis.
 * Marca com id=CARDENAS_FILL_AREA_ID para reconhecimento no Fabric.
 */
function injectFillPath(originalSvg: string, pathD: string, fillColor = "transparent"): string {
  const pathTag = `<path id="${CARDENAS_FILL_AREA_ID}" fill="${fillColor}" fill-rule="evenodd" stroke="none" d="${pathD}"/>`;
  if (/<\/defs\s*>/i.test(originalSvg)) {
    return originalSvg.replace(/(<\/defs\s*>)/i, `$1\n  ${pathTag}\n  `);
  }
  return originalSvg.replace(/(<svg[^>]*>)/i, `$1\n  ${pathTag}\n  `);
}

/**
 * Injeta um path com id=CARDENAS_FILL_AREA_ID e o "d" informado (ex.: extraído de clipPath).
 * Use quando o SVG já tem &lt;clipPath&gt; e você quer que esse path seja usado como área de clip.
 */
export function injectFillPathFromD(originalSvg: string, pathD: string): string {
  return injectFillPath(originalSvg, pathD);
}

/**
 * Normaliza um SVG: preserva contorno e injeta um path de fill (área pintável).
 * 100% JavaScript — roda na Vercel e no browser.
 */
export function normalizeSvg(
  originalSvgString: string,
  options: { fillColor?: string; stripMetadata?: boolean } = {}
): string {
  const { fillColor = "transparent", stripMetadata = true } = options;
  const viewBoxOriginal = extractViewBox(originalSvgString);
  const strokeWidth = parseStrokeWidth(originalSvgString);
  const halfW = strokeWidth / 2;

  const allPolylines = extractPolylines(originalSvgString);
  const allPathPoints = extractPathPoints(originalSvgString);
  const allLines = extractLines(originalSvgString);
  const allPointRings = [...allPolylines, ...allPathPoints, ...allLines];

  const allPolygons: Polygon[] = [];
  for (const ring of allPointRings) {
    const polys = pointsToStrokePolygons(ring, halfW);
    allPolygons.push(...polys);
  }

  if (allPolygons.length === 0) {
    if (stripMetadata) return stripEditorMetadata(originalSvgString);
    return ensureViewBox(originalSvgString, viewBoxOriginal);
  }

  let result: Polygon[];
  try {
    result = polygonClipping.union(...(allPolygons as [Polygon, ...Polygon[]]));
  } catch (_) {
    if (stripMetadata) return stripEditorMetadata(originalSvgString);
    return ensureViewBox(originalSvgString, viewBoxOriginal);
  }

  if (!result || result.length === 0) {
    if (stripMetadata) return stripEditorMetadata(originalSvgString);
    return ensureViewBox(originalSvgString, viewBoxOriginal);
  }

  // Escolher o polígono com maior área (contorno externo) — o union pode devolver vários.
  const byExteriorArea = [...result].sort((a, b) => {
    const areaA = a[0]?.length >= 3 ? ringArea(a[0]) : 0;
    const areaB = b[0]?.length >= 3 ? ringArea(b[0]) : 0;
    return areaB - areaA;
  });
  const firstPoly = byExteriorArea[0];
  const validRings = firstPoly.filter((ring) => ring.length >= 3);
  const byArea = [...validRings].sort((a, b) => ringArea(b) - ringArea(a));
  const viewBoxArea = viewBoxOriginal
    ? (() => {
        const parts = viewBoxOriginal.trim().split(/\s+/);
        if (parts.length >= 4) return Math.abs(parseFloat(parts[2]) * parseFloat(parts[3]));
        return Infinity;
      })()
    : 0;
  const minFillArea = viewBoxArea > 0 ? viewBoxArea * 0.05 : 0;
  const largestArea = byArea.length > 0 ? ringArea(byArea[0]) : 0;
  const useConvexHull =
    byArea.length > 0 &&
    (largestArea < minFillArea ||
      (viewBoxArea === 0 && result.length > 4 && largestArea < 1e5));
  let pathD = byArea.length > 0 ? singleRingToPathD(byArea[0]) : "";
  // Desenhos pontilhados ou muitos segmentos desconectados: usar convex hull como área de fill.
  if (useConvexHull) {
    const allPoints = allPointRings.flat();
    const hull = convexHull(allPoints);
    if (hull.length >= 3) pathD = singleRingToPathD(hull);
  }
  if (!pathD) {
    if (stripMetadata) return stripEditorMetadata(originalSvgString);
    return ensureViewBox(originalSvgString, viewBoxOriginal);
  }
  let out = injectClipPath(originalSvgString, pathD);
  out = injectFillPath(out, pathD, fillColor);
  if (stripMetadata) out = stripEditorMetadata(out);
  out = ensureViewBox(out, viewBoxOriginal);
  return out;
}

/**
 * Remove o segundo subpath do path de fill (tudo a partir de " Z M").
 * Garante que o fill seja renderizado no Fabric e em viewers.
 */
function stripSecondSubpathInFillPath(svgString: string): string {
  const pathRegex = /<path\s+([^>]+)\s*\/>/g;
  let m: RegExpExecArray | null;
  while ((m = pathRegex.exec(svgString)) !== null) {
    const attrs = m[1];
    if (!/fill=/.test(attrs) || !/stroke=["']none["']/i.test(attrs)) continue;
    const dMatch = attrs.match(/d=["']([^"']+)["']/);
    if (!dMatch) continue;
    const d = dMatch[1];
    const idx = d.indexOf(" Z M");
    if (idx === -1) return svgString;
    const newD = d.slice(0, idx) + " Z";
    const newAttrs = attrs.replace(/d=["'][^"']*["']/, `d="${newD}"`);
    const newPathTag = `<path ${newAttrs} />`;
    return svgString.replace(m[0], newPathTag);
  }
  return svgString;
}

/**
 * Pipeline completo: normaliza o SVG do cliente e corrige o path de fill
 * para o Fabric aceitar pintura. Um único ponto de entrada para "SVG pronto pro editor".
 */
export function prepareSvgForEditor(
  originalSvgString: string,
  options: { fillColor?: string; stripMetadata?: boolean } = {}
): string {
  const normalized = normalizeSvg(originalSvgString, options);
  return stripSecondSubpathInFillPath(normalized);
}

/**
 * Encode para salvar no JSON do banco (config.objects.*.svg).
 */
export function encodeForDb(svgString: string): string {
  return svgString
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "")
    .replace(/\r/g, "");
}
