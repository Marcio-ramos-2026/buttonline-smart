/**
 * Prende um objeto à moldura principal como ponteiro de relógio:
 * a ponta encosta na borda da moldura e o corpo aponta para o centro.
 *
 * `angle` em graus como relógio: 0° = topo, sentido horário (90° = direita, 180° = base).
 * `inset` empurra a ponta para dentro, em mm, a partir da borda da moldura.
 *
 * O desenho de origem é sempre na vertical, com a ponta em cima e o corpo descendo:
 * essa é a pose de 0°, apontando do topo para o centro. Por isso `height` é o comprimento
 * do ponteiro e `width` a espessura. O anchor gira a partir daí, então em 45° o objeto sai
 * inclinado em 45° e continua olhando para o centro.
 */
export type Anchor = {
  angle: number;
  inset?: number;
  /**
   * Em volta de que ponto o `rotate` do objeto gira.
   * "center" (padrão) mantém o significado de sempre: o objeto roda no próprio eixo e a ponta
   * sai da borda. "tip" prende a ponta na moldura e o corpo é que se move, para linhas que
   * saem da borda sem mirar no centro. Com `rotate` zerado os dois dão o mesmo resultado.
   */
  pivot?: "center" | "tip";
};

/** Geometria da moldura lida direto do config, em mm. */
export type FrameGeometry = {
  type?: string;
  radius?: number;
  width?: number;
  height?: number;
  top?: number | string;
  left?: number | string;
};

/** Geometria do objeto ancorado, em mm. `rotate` em graus, somado ao ângulo do anchor. */
export type ObjectGeometry = {
  type?: string;
  radius?: number;
  height?: number;
  rotate?: number | string;
};

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Meia-altura do objeto em mm, ou seja, metade do comprimento do ponteiro.
 * Cada tipo converte de um jeito porque as funções de criação em model.ts divergem:
 * circle() usa radius/2, ellipse() usa height direto como ry, o resto é centrado na caixa.
 */
const halfLength = (object: ObjectGeometry): number => {
  switch (object.type) {
    case "circle":
      return Number(object.radius ?? 0) / 2;
    case "ellipse":
      return Number(object.height ?? 0);
    default:
      return Number(object.height ?? 0) / 2;
  }
};

/**
 * Distância do centro da moldura até a borda dela, na direção (dx, dy).
 * Retângulo: interseção com a caixa. Divisão por zero vira Infinity e o min pega o outro termo,
 * então as direções cardeais caem exatamente no meio da aresta sem tratamento especial.
 * `custom` fica de fora: SVG não tem borda calculável.
 */
const frameEdge = (
  frame: FrameGeometry,
  dx: number,
  dy: number
): number | null => {
  let rx: number;
  let ry: number;
  let round: boolean;

  switch (frame.type) {
    case "circle":
      rx = ry = Number(frame.radius ?? 0) / 2;
      round = true;
      break;
    case "ellipse":
      rx = Number(frame.width ?? 0);
      ry = Number(frame.height ?? 0);
      round = true;
      break;
    case "rectangle":
      rx = Number(frame.width ?? 0) / 2;
      ry = Number(frame.height ?? 0) / 2;
      round = false;
      break;
    default:
      return null;
  }

  if (!(rx > 0) || !(ry > 0)) return null;

  return round
    ? 1 / Math.hypot(dx / rx, dy / ry)
    : Math.min(rx / Math.abs(dx), ry / Math.abs(dy));
};

/**
 * Resolve o anchor em top/left (mm a partir do centro do modelo) e rotate (graus).
 * Retorna null quando a moldura não tem geometria analítica (ex.: custom/SVG).
 */
export const resolveAnchor = (
  anchor: Anchor,
  frame: FrameGeometry,
  object: ObjectGeometry
): { top: number; left: number; angle: number } | null => {
  // Direção do raio, do centro da moldura para fora.
  const theta = rad(anchor.angle);
  const dx = Math.sin(theta);
  const dy = -Math.cos(theta);

  const edge = frameEdge(frame, dx, dy);
  if (edge === null) return null;

  // Ponta do ponteiro. inset maior que a moldura para no centro em vez de atravessar.
  const tip = Math.max(0, edge - (anchor.inset ?? 0));
  const half = halfLength(object);

  // A pose de origem já aponta para o centro em 0°, então girar pelo próprio ângulo
  // mantém o ponteiro olhando para o centro em qualquer posição do relógio.
  const angle = anchor.angle + Number(object.rotate ?? 0);

  if (anchor.pivot === "tip") {
    // Ponta fixa na borda: o centro sai meio comprimento dali, na direção para onde o
    // objeto de fato aponta depois do rotate.
    const alpha = rad(angle);
    return {
      left: Number(frame.left ?? 0) + tip * dx - half * Math.sin(alpha),
      top: Number(frame.top ?? 0) + tip * dy + half * Math.cos(alpha),
      angle,
    };
  }

  // Padrão: o centro recua meio comprimento sobre o próprio raio. Fica negativo de propósito
  // quando o ponteiro é mais comprido que o raio: aí ele passa do centro e sai do outro lado.
  const r = tip - half;

  return {
    left: Number(frame.left ?? 0) + r * dx,
    top: Number(frame.top ?? 0) + r * dy,
    angle,
  };
};
