import { prisma } from "@/lib/prisma";
import { Editor } from "./editor";

export default async function Page() {

  const canvas = await prisma.editor_canvas.findFirst({
    where: {
      id: 1
    }
  })

  if(!canvas) return <h1>nao achou nnehum</h1>

  return (
      <Editor model={canvas} />
  )
}
