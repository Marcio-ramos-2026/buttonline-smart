import React, { ReactNode } from "react";

interface VoucherProps {
  validUntil: Date;
  voucherType?: "Promoção" | "Pacote";
}

export const Voucher: React.FC<VoucherProps> = ({
  validUntil,
  voucherType = "Promoção",
}) => {
  const typeIcon = voucherType === "Promoção" ? "🎁" : "🛍️";

  return (
    <div className="bg-gray-50 shadow-lg rounded-lg overflow-hidden max-w-[500px] border border-solid border-primary/15">
      <div className="flex flex-col md:flex-row">
        <div className="bg-primary p-3 text-white md:w-1/4 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <span className="text-xl mr-2">{typeIcon}</span>
            <span className="text-lg font-semibold">{voucherType}</span>
          </div>
        </div>
        <div className="p-3 md:w-3/4">
          <div className="text-center mb-3">
            <p className="text-lg text-gray-600">Válido até:</p>
            <p className="text-xl font-bold text-primary">
              {validUntil.toLocaleDateString()}
            </p>
          </div>
          <div className="mt-3">
            <h3 className="font-semibold mb-1">Termos e condições:</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              eros odio, vehicula eu lectus et, tempus convallis lacus.
              Suspendisse suscipit turpis magna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
