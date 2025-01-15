import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const name = url.searchParams.get("name") || "";
  const locale = url.searchParams.get("locale") || "pt-BR";

  const whereLang: Record<string, any> = {
    "pt-BR": {
      ptBR_name: name ? { contains: name } : undefined,
    },
    en: {
      enUS_name: name ? { contains: name } : undefined,
    },
    "es-ES": {
      esES_name: name ? { contains: name } : undefined,
    },
  };

  const skip = (page - 1) * limit;

  try {
    const icons = await prisma.editor_icons.findMany({
      skip: skip,
      take: limit,
      where: whereLang[locale],
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json({ success: true, data: icons });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Erro ao buscar ícones" },
      { status: 500 }
    );
  }
}
