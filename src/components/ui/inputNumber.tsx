import { cn } from "@/lib/utils";

import { PlusCircle, MinusCircle } from "lucide-react";
import { Input } from "./input";
import {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
} from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const IncrementorInput = forwardRef<HTMLInputElement, InputProps>(
  ({ min = 0, defaultValue = 0, onChange = () => {} }, ref) => {
    const [hitMax, setHitMax] = useState(false);
    const [hitMin, setHitMin] = useState(false);
    const incrementInput = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => incrementInput.current!, []);

    useEffect(() => {
      if (incrementInput.current) {
        incrementInput.current.value = String(defaultValue);
        setHitMin(defaultValue <= min);
        setHitMax(
          incrementInput.current?.value === incrementInput.current?.max
        );
      }
    }, [defaultValue, min]);

    const increment = () => {
      incrementInput.current?.stepUp();
      // Supports onchange events
      incrementInput.current?.dispatchEvent(
        new Event("change", { bubbles: true })
      );
      // Disbale when hitting max
      setHitMax(incrementInput.current?.value === incrementInput.current?.max);
      setHitMin(incrementInput.current?.value === incrementInput.current?.min);
    };

    const decrement = () => {
      incrementInput.current?.stepDown();
      // Supports onchange events
      incrementInput.current?.dispatchEvent(
        new Event("change", { bubbles: true })
      );
      // Disbale when hitting min
      setHitMax(incrementInput.current?.value === incrementInput.current?.max);
      setHitMin(incrementInput.current?.value === incrementInput.current?.min);
    };

    return (
      <div className="flex items-center  p-1.5 w-full gap-1">
        <button
          type="button"
          disabled={hitMin}
          onClick={decrement}
          className="group text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MinusCircle className="h-4 w-4 group-hover:text-gray-800" />
        </button>

        <div className="relative">
          <Input
            min={min}
            type="number"
            ref={incrementInput}
            centerText={true}
            onChange={onChange}
          />
        </div>

        <button
          type="button"
          disabled={hitMax}
          onClick={increment}
          className="group text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PlusCircle className="h-4 w-4 group-hover:text-gray-900" />
        </button>
      </div>
    );
  }
);
IncrementorInput.displayName = "IncrementorInput";

export { IncrementorInput };
