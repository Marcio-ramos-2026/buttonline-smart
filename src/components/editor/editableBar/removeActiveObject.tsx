import { Trash2Icon } from "lucide-react";
import { SetStateAction } from "react";
import * as fabric from "fabric";

export const RemoveActiveObject = ({ canvas, setObject }: { canvas: any, setObject: (object: SetStateAction<fabric.Object | null>) => void }) => {
  const handleRemoveActiveObject = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    canvas.remove(activeObject!);
    canvas.discardActiveObject();
    setObject(null);
    canvas.requestRenderAll();
  };
  return (
    <button className="text-red-500" onClick={handleRemoveActiveObject}>
      <Trash2Icon />
    </button>
  );
};
