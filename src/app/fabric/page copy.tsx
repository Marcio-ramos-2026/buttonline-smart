"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric"; // v6

import { Canvas, Rect } from "fabric"; // browser

export default function FabricJSCanvas() {
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
    const c = new fabric.Canvas("canvas", {
      height: 400,
      width: 800,
      backgroundColor: "#000",
    });
    

    // settings for all canvas in the app
    // ...

    setCanvas(c);

    return () => {
      // ...
    };
  }, []);


  const addRect = (canvas?: fabric.Canvas) => {
    const rect = new fabric.Rect({
      height: 280,
      width: 200,
      stroke: "#2BEBC8",
    });
    canvas?.add(rect);
    canvas?.requestRenderAll();
  };

  return (
    <div>
      aaaaaaaaaaaaa
      <button onClick={() => addRect(canvas)}>Rectangle</button>
      <canvas id="canvas" />
    </div>
  );
}
