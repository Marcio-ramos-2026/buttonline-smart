import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import {
  Alert as AlertBase,
  AlertDescription,
  AlertTitle,
  VariantType,
} from "../ui/alert";

interface AlertProps extends VariantType {
  title?: string;
  content: string;
}

export const Alert = ({ variant, title, content }: AlertProps) => {
  return (
    <AlertBase variant={variant} className="flex gap-2 items-center">
      {variant === "danger" && <CircleX />}
      {variant === "success" && <CircleCheck />}
      {variant === "warning" && <CircleAlert />}
      <div className="flex flex-col justify-center items-start">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{content}</AlertDescription>
      </div>
    </AlertBase>
  );
};
