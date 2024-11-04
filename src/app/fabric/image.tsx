"use client";

import { useFabricContext } from "@/context/fabric";

import * as fabric from "fabric";
import coracaox from '../../../public/BUTTONLINE_CORAÇÃO_FURO_TRACEJADO.svg'

export default function Comp() {
  const { canvas } = useFabricContext();

  const test = async () => {
    // const path = 'M 230 230 A 45 45, 0, 1, 1, 275 275 L 275 230 Z';
 
    const path = await fabric.loadSVGFromURL('/BUTTONLINE_CORAÇÃO_FURO_TRACEJADO.svg')

   

    const image = await fabric.FabricImage.fromURL(
      "https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/06/bumba-meu-boi.jpg",
      {},
      { opacity: 1,backgroundColor: 'black',borderColor:'black',hasBorders: true}
    );

    const group = new fabric.Group(path.objects as fabric.FabricObject[], {
      originX: 'center',
      originY: 'center',
      
      scaleX:4,
      scaleY:4,
      width: image.width,

   })

   image.clipPath = group

    canvas?.add(image);
  };

  return <button onClick={test}>Image</button>;
}


export const CanvasClip = () => {
  const { canvas,clip } = useFabricContext();

  return <button onClick={()=>{
    clip()
  }}>CLIP</button>;
}