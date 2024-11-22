import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const name = url.searchParams.get("name") || "";

  const skip = (page - 1) * limit;

  try {
    const icons = await prisma.editor_icons.findMany({
      skip: skip,
      take: limit,
      where: {
        ptBR_name: name ? { contains: name } : undefined,
      },
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json({ success: true, data: icons });
  } catch (error) {
    console.log("c", error);

    return NextResponse.json(
      { success: false, message: "Erro ao buscar ícones" },
      { status: 500 }
    );
  }
}
