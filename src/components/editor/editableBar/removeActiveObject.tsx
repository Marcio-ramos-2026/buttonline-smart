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
    <button className="border border-solid border-danger rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-danger-light/50" onClick={handleRemoveActiveObject}>
      <Trash2Icon className="text-red-500" />
    </button>
  );
};
