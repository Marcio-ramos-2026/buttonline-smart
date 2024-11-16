import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

console.log('c', 'caiu')

  try {
    const icons = await prisma.editorIcons.findMany();
    return NextResponse.json({ success: true, data: icons });
  } catch (error) {

    console.log('c', error)

    return NextResponse.json(
      { success: false, message: "Erro ao buscar ícones" },
      { status: 500 }
    );
  }
}
