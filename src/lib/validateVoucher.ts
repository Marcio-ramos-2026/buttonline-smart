import type { User as UserType } from "@prisma/client";
import { prisma } from "./prisma";

export const VOUCHER_DAYS = 30

export async function validateVoucher(user: UserType) {
  let voucher;
  const today = new Date();
  today.setDate(today.getDate() - 1);
  // today.setDate(today.getDate() - VOUCHER_DAYS);
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

  let order;

  for (let i = 0; i < dataBnw.result.total; i++) {
    if (dataBnw.result.data[i].customer.email !== user.email) continue;
    const customerOrder = dataBnw.result.data[i];
    if (!order) {
      order = customerOrder;
      continue;
    }
    if (
      order &&
      new Date(order.created).getTime() < new Date(customerOrder).getTime()
    ) {
      order = customerOrder;
    }
  }

  if (!order) return;
  const voucherTime = new Date(order.created);
  voucherTime.setDate(voucherTime.getDate() + VOUCHER_DAYS);

  const update = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      voucherTime: voucherTime,
    },
  });

  //@ts-ignore
  const diffInMs = voucherTime - today;
  const availableDays = diffInMs / (1000 * 60 * 60 * 24);

  await prisma.voucher.create({
    data: {
      type: "Compra",
      orderId: order.id.toString(),
      availableDays: Math.trunc(availableDays),
    },
  });

  voucher = update.voucherTime;

  return voucher;
}
