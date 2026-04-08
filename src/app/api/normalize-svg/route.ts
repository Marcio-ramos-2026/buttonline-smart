import { NextRequest, NextResponse } from "next/server";
import { normalizeSvg, encodeForDb } from "@/lib/svg-normalizer";

/**
 * POST /api/normalize-svg
 * Body: { svg: string, fillColor?: string }
 * Retorna: { normalized: string, encoded?: string }
 *
 * Normalização em JavaScript puro — roda na Vercel (sem Inkscape).
 * Use no painel de upload: cliente envia o SVG, você retorna o normalizado e salva no banco.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const svg = typeof body.svg === "string" ? body.svg : "";
    const fillColor = typeof body.fillColor === "string" ? body.fillColor : undefined;

    if (!svg.trim()) {
      return NextResponse.json(
        { error: "Campo 'svg' é obrigatório e deve ser uma string não vazia." },
        { status: 400 }
      );
    }

    const normalized = normalizeSvg(svg, { fillColor, stripMetadata: true });
    const encoded = encodeForDb(normalized);

    return NextResponse.json({ normalized, encoded });
  } catch (e) {
    console.error("[normalize-svg]", e);
    return NextResponse.json(
      { error: "Erro ao normalizar SVG. Verifique o formato do arquivo." },
      { status: 500 }
    );
  }
}
