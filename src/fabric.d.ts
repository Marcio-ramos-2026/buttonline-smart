import { FabricObject } from "fabric";

declare module "fabric" {
  interface FabricObject {
    cardenas_canvas?: string;
    cardenas_print?: boolean;
    cardenas_mark?: boolean;
  }
  // to have the properties typed in the exported object
  interface SerializedObjectProps {
    cardenas_canvas?: string;
    cardenas_print?: boolean;
    cardenas_mark?: boolean;
  }
}
