import { NextResponse } from "next/server";
import { fetchIcons } from "@/lib/db";

export async function GET() {

console.log('c', 'caiu')

  try {
    const icons = await fetchIcons();
    return NextResponse.json({ success: true, data: icons });
  } catch (error) {

    console.log('c', error)

    return NextResponse.json(
      { success: false, message: "Erro ao buscar ícones" },
      { status: 500 }
    );
  }
}
