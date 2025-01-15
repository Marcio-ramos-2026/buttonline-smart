import type { User as UserType } from "@prisma/client";
import { prisma } from "./prisma";

export async function validateVoucher(user: UserType) {
  let voucher;
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const month = today.getMonth() + 1;

  const res = await fetch(
    `${process.env.BNW_ENDPOINT}/orders?createdFrom=${today.getFullYear()}-${month.toString().padStart(2, "0")}-${today.getDate()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.BNW_TOKEN}`,
      },
    }
  );
  const dataBnw = await res.json();

  for (let i = 0; i < dataBnw.result.total; i++) {
    if (dataBnw.result.data[i].customer.email === user.email) {
      const voucherTime = new Date(dataBnw.result.data[i].created);
      voucherTime.setMonth(voucherTime.getMonth() + 1);

      const update = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          voucherTime: voucherTime,
        },
      });

      voucher = update.voucherTime
    }
  }

  return voucher
}
