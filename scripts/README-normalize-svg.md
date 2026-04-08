# Normalização de SVG (Buttonline Smart)

## Um comando: SVG do cliente → SVG pintável no Fabric

Coloque os SVGs do cliente em **`public/svg/client/`** e rode:

```bash
npm run svg:prepare
```

Isso lê todos os `.svg` de `public/svg/client/`, normaliza + corrige o fill, e grava em **`public/svg/output/`** com **mesmo-nome.svg** e **mesmo-nome.txt** (encoded para salvar no banco).

```bash
# Cor do fill (padrão #000000)
npm run svg:prepare -- --fill "#ff0000"

# Um arquivo ou pasta customizada
npm run svg:prepare -- caminho/arquivo.svg
npx tsx scripts/prepare-svg-for-editor.ts outra-pasta/ -o saida/
```

O script **normaliza** (injeta o path de área pintável) e **corrige o fill** (remove o segundo subpath para o Fabric/viewers renderizarem).

---

## Objetivo

Garantir que **qualquer** SVG de camada tenha:

- **Contorno** preservado (traços originais: linha contínua, pontilhada, etc.)
- **Área pintável** (um path com fill), para o Fabric poder pintar quando a camada for `cardenas_editable`

O SVG pode continuar com vários elementos por dentro; o importante é existir visualmente uma linha que delimita área e que essa área possa ser pintada.

---

## Sem Inkscape (Vercel, painel de upload)

**Não é obrigatório usar Inkscape.** Há normalização em **JavaScript puro** que roda na Vercel e no browser.

### Opção A: API (recomendado para upload no painel)

```http
POST /api/normalize-svg
Content-Type: application/json

{ "svg": "<svg>...</svg>", "fillColor": "#000000" }

→ 200 { "normalized": "<svg>...</svg>", "encoded": "..." }
```

O cliente sobe o arquivo no painel; o front chama essa API com o conteúdo do SVG e recebe o normalizado (e opcionalmente `encoded` para salvar no banco). **Roda na Vercel** — zero dependência de binário.

### Opção B: Script em JS puro (local ou CI)

```bash
npm run svg:normalize:js
# ou um arquivo:
npx tsx scripts/normalize-svg-pure-js.ts public/svg/client/camiseta.svg
```

Usa `src/lib/svg-normalizer.ts` (polygon-clipping + points-on-path). Saída em `public/svg/output/`.

### Opção C: Import no front (normalizar no browser antes de enviar)

```ts
import { normalizeSvg, encodeForDb } from '@/lib/svg-normalizer';

const file = event.target.files[0];
const text = await file.text();
const normalized = normalizeSvg(text);
// enviar `normalized` para a API ou salvar no estado
```

Assim o upload já envia o SVG normalizado; a API só persiste.

---

## Com Inkscape (local, melhor qualidade em formas muito complexas)

### 1. Um único arquivo

```bash
node scripts/normalize-svg.js public/svg/client/camiseta.svg
```

### 2. Todos os SVG da pasta client

```bash
npm run svg:normalize
```

Saída em `public/svg/output/`: `*.svg` e `*.txt` (encoded para o banco).

**Requisitos:** Inkscape no PATH (`inkscape`, `/usr/bin/inkscape`, `/opt/homebrew/bin/inkscape`). Sem Inkscape, o script antigo só faz limpeza; use a **Opção A ou B** acima para ter fill.

## Fluxo interno

**Pure JS (`src/lib/svg-normalizer.ts`):**
1. Extrai polylines e paths do SVG; lê `stroke-width` (ex.: .72px).
2. Converte cada segmento de traço em um “retângulo” (segmento expandido pela metade do stroke) e faz **union** com `polygon-clipping`.
3. Converte o multipolygon resultante em path `d` e injeta no SVG original como `<path fill="..." stroke="none" d="..."/>`.
4. Limpeza: remove metadados; mantém viewBox do original.

**Inkscape (script `normalize-svg.js`):**
1. Inkscape: select-all → object-to-path → stroke-to-path → path-union → stroke:none, fill preto.
2. Mescla: injeta o path de fill no SVG original.
3. Limpeza: idem acima.

## Correção do fill (path com dois subpaths)

Em alguns SVGs normalizados o path de fill tem dois subpaths (contorno externo + furo). Alguns viewers não preenchem corretamente. O script **fix-svg-fill** remove o segundo subpath, deixando só o contorno externo, para o fill renderizar sempre.

```bash
# Um arquivo (sobrescreve ou -o saida.svg)
npm run svg:fix-fill -- public/svg/output/camiseta.svg

# Todos os .svg da pasta output (sobrescreve)
npm run svg:fix-fill

# Pasta customizada + cor do fill
node scripts/fix-svg-fill.js minha-pasta/ --fill "#ff0000"

# Saída em outra pasta
node scripts/fix-svg-fill.js public/svg/output/ -o public/svg/fixed/
```

Rode **depois** da normalização (`svg:normalize:js` ou API). O SVG já deve ter o path de fill injetado (primeiro path com `fill` e `stroke="none"`).

## Uso no banco

Copie o conteúdo de `public/svg/output/nome.txt` (já com escape `\"` e sem quebras de linha) para o campo `config.objects["X"].svg` do modelo no banco. Ou use a string retornada por `encodeForDb(normalized)` ao salvar via API.

## Próximos passos (futuro)

- **API de upload**: POST com SVG → chama `normalizeSvg()` → retorna SVG normalizado (ou salva direto no modelo).
- **Transform no root**: hoje só avisamos; assar `transform="rotate(-90)"` no path exigiria passo extra (ex.: Inkscape com ação ou lib de geometria).
- **Clip-path**: SVGs com `clip-path` podem ser pré-processados no Inkscape (Object → Clip → Set) antes de rodar o normalizador, ou tratar no script (remover / assar).
