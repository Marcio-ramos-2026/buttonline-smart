#!/bin/bash

INPUT="public/conversion/original-svg"
OUTPUT="public/conversion/inkscape-svg"

mkdir -p "$OUTPUT"

found=false

for file in "$INPUT"/*.svg; do
  found=true
  name=$(basename "$file")

  echo "▶ Inkscape normalize $name"

  inkscape "$file" \
    --export-plain-svg \
    --export-filename="$OUTPUT/$name"
done

if [ "$found" = false ]; then
  echo "❌ Nenhum SVG encontrado em $INPUT"
  exit 1
fi
