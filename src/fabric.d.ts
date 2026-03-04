import { FabricObject } from "fabric";

declare module "fabric" {
  interface FabricObject {
    cardenas_canvas?: string;
    cardenas_print?: boolean;
    cardenas_mark?: boolean;
    cardenas_tags?: Record<string, string>;
    cardenas_overlay?: boolean;
    /** Wrapper interno que contém os filhos nested de um grupo — nunca deve aparecer no overlay. */
    cardenas_children_wrapper?: boolean;
    /** Clip path usado no shape (ex.: contorno da camiseta). Aplicado no grupo raiz para clipar marca e filhos. */
    cardenasClipPath?: fabric.FabricObject;
  }

  // to have the properties typed in the exported object
  interface SerializedObjectProps {
    cardenas_canvas?: string;
    cardenas_print?: boolean;
    cardenas_mark?: boolean;
    cardenas_type?: string;
  }
}
