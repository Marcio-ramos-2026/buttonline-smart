# Documentação de Configuração de Modelos

Guia completo para criar JSONs de configuração de modelos do editor.

---

## Estrutura Raiz

```json
{
  "mark": { ... },
  "objects": { ... },
  "gabarito": { ... }
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `mark` | objeto | Não | Marca de corte (quadrado preto) |
| `objects` | objeto | **Sim** | Dicionário de shapes do modelo |
| `gabarito` | objeto | **Sim** | Configuração do PDF de impressão |

---

## `mark` — Marca de corte

```json
"mark": {
  "position": "left",
  "width": 10,
  "height": 10
}
```

| Campo | Tipo | Padrão | Valores |
|---|---|---|---|
| `position` | string | `"left"` | `"left"` `"right"` `"top"` `"bottom"` |
| `width` | número | `10` | Largura em pixels |
| `height` | número | `10` | Altura em pixels |

---

## `objects` — Shapes do modelo

Dicionário de chaves livres. Cada valor é um **shape** que pode ser:
- Uma **folha** (`rectangle`, `circle`, `ellipse`, `custom`)
- Um **grupo** (tem `objects` com filhos aninhados)

### Propriedades comuns a todos os shapes

| Campo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `background` | string | — | Cor de fundo (aceita qualquer valor CSS de cor) |
| `color` | string | — | Cor principal do shape (substitui `background` em alguns tipos) |
| `cardenas_print` | boolean | `true` | Se `false`, o shape **não aparece no PDF** de impressão |
| `cardenas_overlay` | boolean | — | Se `true`, aparece na camada de overlay (por cima da arte) |
| `tags` | objeto | — | Habilita controles no painel **Configurações** |
| `tagGroup` | string | — | Agrupa shapes para controle compartilhado |

---

## Tipos de shape

### `rectangle` — Retângulo

```json
"fundo": {
  "type": "rectangle",
  "width": 80,
  "height": 120,
  "top": 0,
  "left": 0,
  "color": "#ffffff",
  "cardenas_print": true,
  "background": "#ffffff"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `type` | `"rectangle"` | **Sim** | — |
| `width` | número | **Sim** | Largura em **mm** |
| `height` | número | **Sim** | Altura em **mm** |
| `top` | número | Não | Posição Y (px, relativo ao pai) |
| `left` | número | Não | Posição X (px, relativo ao pai) |
| `rotate` | número | Não | Rotação em graus |
| `strokeWidth` | número | Não | Espessura da borda (padrão: `0.3`) |
| `strokeDashArray` | `[n, n]` | Não | Borda tracejada. Ex: `[5, 3]` |
| `radius` | número | Não | Arredondamento dos cantos |
| `color` | string | Não | Cor de preenchimento (padrão: `"white"`) |

---

### `circle` — Círculo

```json
"bolinha": {
  "type": "circle",
  "radius": 20,
  "color": "#ff0000",
  "cardenas_print": true,
  "background": "#ff0000"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `type` | `"circle"` | **Sim** | — |
| `radius` | número | **Sim** | Diâmetro em **mm** (internamente divide por 2) |
| `top` | número | Não | Posição Y |
| `left` | número | Não | Posição X |
| `rotate` | número | Não | Rotação em graus |
| `strokeWidth` | número | Não | Espessura da borda (padrão: `1`) |
| `color` | string | Não | Cor de preenchimento |

---

### `ellipse` — Elipse

```json
"oval": {
  "type": "ellipse",
  "width": 60,
  "height": 40,
  "color": "#0000ff",
  "cardenas_print": true,
  "background": "#0000ff"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `type` | `"ellipse"` | **Sim** | — |
| `width` | número | **Sim** | Largura (raio X × 2) em **mm** |
| `height` | número | **Sim** | Altura (raio Y × 2) em **mm** |
| `top` | número | Não | Posição Y |
| `left` | número | Não | Posição X |
| `rotate` | número | Não | Rotação em graus |
| `strokeWidth` | número | Não | Espessura da borda (padrão: `1`) |
| `color` | string | Não | Cor de preenchimento (padrão: `"white"`) |

---

### `custom` — SVG personalizado

```json
"camiseta": {
  "type": "custom",
  "width": 100,
  "height": 120,
  "svg": "<svg xmlns='...'> ... </svg>",
  "color": "#ffffff",
  "cardenas_print": true,
  "background": "#ffffff"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `type` | `"custom"` | **Sim** | — |
| `width` | número | **Sim** | Largura final em **mm** |
| `height` | número | **Sim** | Altura final em **mm** |
| `svg` | string | **Sim** | Conteúdo SVG completo como string |
| `top` | número | Não | Posição Y |
| `left` | número | Não | Posição X |
| `rotate` | número | Não | Rotação em graus |
| `color` | string | Não | Cor aplicada na área de fill (`cardenas-fill-area`) |

> **Dica SVG:** Para que o color picker funcione, o SVG precisa ter um `<path>` com `id="cardenas-fill-area"`. O normalizador injeta esse path automaticamente a partir do `clipPath` do SVG.

---

## Grupos — shapes com filhos

Quando um shape tem a propriedade `objects`, ele vira um **grupo**. Os filhos ficam clipados ao contorno do pai (shape `custom`).

```json
"camiseta": {
  "type": "custom",
  "width": 100,
  "height": 120,
  "svg": "<svg ...> ... </svg>",
  "color": "#ffffff",
  "background": "#ffffff",
  "cardenas_print": true,
  "objects": {
    "listra_a": {
      "type": "rectangle",
      "width": 20,
      "height": 120,
      "top": -30,
      "left": -20,
      "color": "#ff0000",
      "background": "#ff0000",
      "cardenas_print": true,
      "tags": { "background": "Cor da Listra" },
      "tagGroup": "listras"
    },
    "listra_b": {
      "type": "rectangle",
      "width": 20,
      "height": 120,
      "top": -30,
      "left": 20,
      "color": "#ff0000",
      "background": "#ff0000",
      "cardenas_print": true,
      "tags": { "background": "Cor da Listra" },
      "tagGroup": "listras"
    }
  }
}
```

- Filhos com `top`/`left` são posicionados **relativos ao centro do pai**.
- Filhos são automaticamente clipados ao contorno do shape pai (`custom`).
- Grupos podem ser aninhados recursivamente.

---

## `tags` — Painel Configurações

A propriedade `tags` ativa o shape no painel **Configurações** do editor. O usuário final pode alterar cores sem precisar clicar no canvas.

### Tag disponível: `background`

Exibe um color picker para alterar a cor de preenchimento do shape.

```json
"tags": {
  "background": "Cor da camisa"
}
```

O valor da tag é o **rótulo** exibido no painel. Pode ser:

#### String simples (sem i18n)

```json
"tags": { "background": "Cor da camisa" }
```

#### Mapa de locales (com i18n)

Quando a loja opera em múltiplos idiomas, use um objeto com as chaves de locale:

```json
"tags": {
  "background": {
    "pt-BR": "Cor da camisa",
    "en": "Shirt color",
    "es-ES": "Color de la camiseta"
  }
}
```

O editor resolve automaticamente pelo locale atual do usuário. Se o locale não estiver no mapa, usa `en` → `pt-BR` → primeiro disponível.

---

## `tagGroup` — Controle compartilhado

Quando múltiplos shapes devem ser alterados juntos com **um único color picker**, defina o mesmo `tagGroup` neles.

```json
"listra_esquerda": {
  "type": "rectangle",
  "tags": { "background": "Cor das Listras" },
  "tagGroup": "listras"
},
"listra_direita": {
  "type": "rectangle",
  "tags": { "background": "Cor das Listras" },
  "tagGroup": "listras"
},
"listra_centro": {
  "type": "rectangle",
  "tags": { "background": "Cor das Listras" },
  "tagGroup": "listras"
}
```

Resultado: aparece **um único controle** "Cor das Listras" no painel, e alterar a cor muda os três shapes simultaneamente.

> Sem `tagGroup`, cada shape com `tags` aparece como um controle separado no painel.

---

## `gabarito` — Configuração de impressão (PDF)

```json
"gabarito": {
  "pdf": "A4",
  "orientation": "vertical",
  "line": "vertical",
  "positions": {
    "frente": { "x": 297, "y": 210, "rotate": 0 },
    "costa": { "x": 297, "y": 450, "rotate": 0 }
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `pdf` | string | **Sim** | Tamanho do papel: `"A4"`, `"A5"`, `"Letter"` |
| `orientation` | string | Não | `"vertical"` ou `"horizontal"` |
| `line` | string | Não | Linha guia única: `"vertical"` ou `"horizontal"` |
| `lines` | array | Não | Múltiplas linhas guia (ver abaixo) |
| `positions` | objeto | **Sim** | Posições de cada canvas no PDF |

### `positions`

Cada posição representa onde um canvas aparece no PDF:

```json
"positions": {
  "frente": { "x": 297, "y": 210, "rotate": 0 },
  "costa": { "x": 297, "y": 450 }
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `x` | número | Posição X no PDF (em pontos) |
| `y` | número | Posição Y no PDF (em pontos) |
| `rotate` | número | Rotação em graus (opcional) |

### `lines` — Linhas guia múltiplas

```json
"lines": [
  { "x": "lower", "y": 300 },
  { "x": "higher", "y": 500 }
]
```

Valores de posição aceitos: número em pontos, `"lower"` (início), `"higher"` (fim).

---

## Exemplo completo — Camiseta com listras editáveis

```json
{
  "mark": {
    "position": "left",
    "width": 10,
    "height": 10
  },
  "objects": {
    "camiseta": {
      "type": "custom",
      "width": 100,
      "height": 120,
      "svg": "<svg xmlns='http://www.w3.org/2000/svg'>...</svg>",
      "color": "#ffffff",
      "background": "#ffffff",
      "cardenas_print": true,
      "tags": {
        "background": {
          "pt-BR": "Cor da camisa",
          "en": "Shirt color",
          "es-ES": "Color de la camiseta"
        }
      },
      "objects": {
        "listra_1": {
          "type": "rectangle",
          "width": 15,
          "height": 130,
          "top": 0,
          "left": -25,
          "color": "#ff0000",
          "background": "#ff0000",
          "cardenas_print": true,
          "tags": {
            "background": {
              "pt-BR": "Cor das listras",
              "en": "Stripe color",
              "es-ES": "Color de las rayas"
            }
          },
          "tagGroup": "listras"
        },
        "listra_2": {
          "type": "rectangle",
          "width": 15,
          "height": 130,
          "top": 0,
          "left": 25,
          "color": "#ff0000",
          "background": "#ff0000",
          "cardenas_print": true,
          "tags": {
            "background": {
              "pt-BR": "Cor das listras",
              "en": "Stripe color",
              "es-ES": "Color de las rayas"
            }
          },
          "tagGroup": "listras"
        }
      }
    },
    "contorno": {
      "type": "custom",
      "width": 100,
      "height": 120,
      "svg": "<svg xmlns='http://www.w3.org/2000/svg'>...</svg>",
      "color": "transparent",
      "background": "transparent",
      "cardenas_print": false,
      "cardenas_overlay": true
    }
  },
  "gabarito": {
    "pdf": "A4",
    "orientation": "vertical",
    "positions": {
      "frente": { "x": 297, "y": 300 }
    }
  }
}
```

---

## Referência rápida

| Quero... | Use... |
|---|---|
| Shape preenchível com cor | `type: "custom"` com SVG normalizado |
| Shape simples | `type: "rectangle"` / `circle` / `ellipse` |
| Filhos clipados ao contorno | `objects: { ... }` dentro de um `custom` |
| Aparecer no painel Configurações | `tags: { background: "..." }` |
| Label em múltiplos idiomas | `tags: { background: { "pt-BR": "...", "en": "..." } }` |
| Vários shapes com mesmo color picker | Mesmo `tagGroup` em todos |
| Não imprimir no PDF | `cardenas_print: false` |
| Aparecer como overlay (acima da arte) | `cardenas_overlay: true` |
