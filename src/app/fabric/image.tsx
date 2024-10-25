"use client";

import { useFabricContext } from "@/context/fabric";

import * as fabric from "fabric";

export default function Comp() {
  const { canvas } = useFabricContext();

  const test = async () => {
    console.log("tet");

    const x = await fabric.FabricImage.fromURL(
      "https://static.wixstatic.com/media/d40923_64569dd49a3a45c5b075dfe21d291463~mv2.jpg/v1/crop/x_2,y_46,w_1000,h_658/fill/w_400,h_260,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/d40923_64569dd49a3a45c5b075dfe21d291463~mv2.jpg",
      {},
      { opacity: 0.85 }
    );

    canvas.add(x);
  };

  return <button onClick={test}>iamge</button>;
}
