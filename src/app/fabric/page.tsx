import React, { useEffect, useRef } from "react";
import FabricContextProvider from "@/context/fabric";
import Comp, { CanvasClip } from "./image";

export default function FabricJSCanvas() {
  return (
    <FabricContextProvider>
      <div>
        <Comp></Comp>
        <CanvasClip />
      </div>
    </FabricContextProvider>
  );
}