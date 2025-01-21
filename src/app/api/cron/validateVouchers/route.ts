import { dateUTC } from "@/lib/dateUTC";
import { prisma } from "@/lib/prisma";
import { VOUCHER_DAYS } from "@/lib/validateVoucher";
import { NextResponse } from "next/server";

export async function GET() {
  const today = dateUTC();
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

  if (!dataBnw) return NextResponse.json({ message: 'Sem dados para validar.' });

  let lastUpdate = await prisma.config.findFirst({
    orderBy: {
      id: "desc",
    },
  });

  const lastUpdateGap = !lastUpdate ? today : (lastUpdate.date as Date);
  lastUpdateGap.setMinutes(lastUpdateGap.getMinutes() - 10);
  const customersToUpdate: { [key: string]: Date } = {};

  for (let i = 0; i < dataBnw.length; i++) {
    const created = dateUTC(dataBnw[i].created);
    if (created.getTime() < lastUpdateGap.getTime()) continue;
    if (
      customersToUpdate[dataBnw[i].customer.email]?.getTime() >
      created.getTime()
    )
      continue;
    created.setDate(created.getDate() + VOUCHER_DAYS);
    customersToUpdate[dataBnw[i].customer.email] = created;
  }

  const keysCustomersToUpdate = Object.keys(customersToUpdate);

  if (!keysCustomersToUpdate.length) return NextResponse.json({ message: 'Nenhum cliente para atualizar' });


  

  keysCustomersToUpdate.forEach(async (customer) => {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: customer,
      },
    });
    if (!existingUser) return NextResponse.json({ message: 'Usuário não encontrado.' });
    await prisma.user.update({
      where: {
        email: customer,
      },
      data: {
        voucherTime: new Date(customersToUpdate[customer]),
      },
    });
  });

  await prisma.config.upsert({
    where: {
      id: "CRON_VOUCHER",
    },
    update: {
      date: today,
    },
    create: {
      id: "CRON_VOUCHER",
      date: today,
    },
  });

  return NextResponse.json({ message: 'Vouchers atualizados.' })
}
