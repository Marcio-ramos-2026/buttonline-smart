"use client";

import Image from "next/image";
import styles from "./style.module.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PolicyCookies() {
  const t = useTranslations("pages.cookiesPolicy");
  return (
    <div className="bg-gray-200 py-8">
      <Image
        alt="Buttonline"
        src="/logo.svg"
        height={46}
        width={400}
        className="mx-auto my-10"
      />
      <div className={`container py-10 bg-white ${styles.policy}`}>
        <Link href={"login"}>
          <Button>{t("goBack")}</Button>
        </Link>

        <h1 className="text-2xl font-bold	">{t("title")}</h1>
        <p>{t("lastUpdate")}</p>

        <p>{t("introduction")}</p>

        <h2>{t("whatAreCookies.title")}</h2>
        <p>{t("whatAreCookies.content.firstParagraph")}</p>
        <p>{t("whatAreCookies.content.secondParagraph")}</p>
        <p>{t("whatAreCookies.content.thirdParagraph")}</p>

        <h2>{t("whyUseCookies.title")}</h2>
        <p>{t("whyUseCookies.content")}</p>

        <h2>{t("howAreUsed.title")}</h2>
        <p>{t("howAreUsed.subtitle")}</p>
        <p>
          <strong>{t("howAreUsed.content.firstParagraph.emphasis")}</strong> {t("howAreUsed.content.firstParagraph.content")}
        </p>
        <p>
        {t("howAreUsed.content.secondParagraph")}
        </p>

        <h2>{t("thirdPartyCookies.title")}</h2>
        <p>
        {t("thirdPartyCookies.content")}
        </p>

        <h2>{t("trackingTechnologies.title")}</h2>
        <p>
        {t("trackingTechnologies.content")}
        </p>

        <h2>{t("dontWantCookies.title")}</h2>
        <p>
        {t("dontWantCookies.content")}
        </p>
        <p>
        {t("footer.firstParagraph.content")}{" "}
          <Link className="text-teal-500" href="mailto:dpo@cardenas.com.br">
            {t("footer.firstParagraph.link")}
          </Link>
        </p>
        <p>{t("footer.table.title")}</p>

        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              <tr className="bg-teal-500 ">
                <th
                  colSpan={4}
                  className=" text-white py-4 "
                  style={{ textAlign: "center" }}
                >
                  {t("footer.table.content.headerTable")}
                </th>
              </tr>

              <tr>
                <th>{t("footer.table.content.headerCol1")}</th>
                <th>{t("footer.table.content.headerCol2")}</th>
                <th>{t("footer.table.content.headerCol3")}</th>
                <th>{t("footer.table.content.headerCol4")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("footer.table.content.col1")}</td>
                <td>
                  <Link
                    className="text-teal-500"
                    href="buttonline.com.br"
                    target="_blank"
                  >
                    {t("footer.table.content.col2")}
                  </Link>
                </td>
                <td style={{ minWidth: 200 }}>
                {t("footer.table.content.col3")}
                </td>
                <td>{t("footer.table.content.col4")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
