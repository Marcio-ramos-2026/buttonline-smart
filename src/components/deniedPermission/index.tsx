import { Fingerprint } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const DeniedPermission = async () => {
  const p_t = await getTranslations("permissions");
  
  return (
    <div className="h-screen w-full flex flex-col gap-6 items-center justify-center">
      <Fingerprint className="w-36 h-36 text-primary" />
      <div className="text-3xl font-medium">{p_t("denied")}</div>
    </div>
  );
};
