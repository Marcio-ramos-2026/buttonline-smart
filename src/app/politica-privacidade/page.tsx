"use client";

import Image from "next/image";
import styles from "./style.module.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PolicyPrivacy() {
  const t = useTranslations("pages.privacy");
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

        <h2>{t("body.declaration.title")}</h2>
        <p>{t("body.declaration.content")}</p>

        <h2>{t("body.personalInformation.title")}</h2>
        <p>{t("body.personalInformation.subTitle")}</p>
        <p>
          <strong>{t("body.personalInformation.site.title")}</strong>{" "}
          {t("body.personalInformation.site.content")}
        </p>
        <p>
          <strong>{t("body.personalInformation.register.title")}</strong>{" "}
          {t("body.personalInformation.register.content.firstParagraph")}
        </p>
        <p>{t("body.personalInformation.register.content.secondParagraph")}</p>
        <p> {t("body.personalInformation.register.content.thirdParagraph")}</p>

        <p>
          <strong>{t("body.personalInformation.buttonline.title")}</strong>{" "}
          {t("body.personalInformation.buttonline.content1")}{" "}
          <Link
            className="text-teal-500"
            href="https://buttonline.com.br/"
            target="_blank"
          >
            {t("body.personalInformation.buttonline.link")}
          </Link>
          {t("body.personalInformation.buttonline.content2")}
        </p>
        <p>
          <strong>{t("body.personalInformation.newsletter.title")}</strong>{" "}
          {t("body.personalInformation.newsletter.content")}
        </p>
        <p>
          <strong>{t("body.personalInformation.channelService.title")}</strong>{" "}
          {t("body.personalInformation.channelService.contetn")}
        </p>
        <p>
          <strong>{t("body.personalInformation.cookies.title")}</strong>{" "}
          {t("body.personalInformation.cookies.content")}{" "}
          <Link
            className="text-teal-500"
            href="politica-cookies"
            target="_blank"
          >
            {t("body.personalInformation.cookies.link")}
          </Link>
        </p>
        <p>
          <strong>{t("body.personalInformation.candidates.title")}</strong>{" "}
          {t("body.personalInformation.candidates.content")}
        </p>
        <p>
          <strong>{t("body.personalInformation.employees.title")}</strong>{" "}
          {t("body.personalInformation.employees.content")}
        </p>

        <h2>{t("body.socialMidias.title")}</h2>
        <p>{t("body.socialMidias.content.firstParagraph")}</p>
        <p>{t("body.socialMidias.content.secondParagraph")}</p>
        <p>{t("body.socialMidias.content.thirdParagraph")}</p>

        <h2>{t("body.legalBases.title")}</h2>
        <p>{t("body.legalBases.subTitle")}</p>

        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("body.legalBases.content.table.purposes.title")}</th>
                <th>{t("body.legalBases.content.table.legalBase.title")}</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col1")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col1")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col2")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col2")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col3")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col3")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col4")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col4")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col5")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col5")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col6")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col6")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col7")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col7")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col8")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col8")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col9")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col9")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col10")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col10")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col11")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col11")}</td>
              </tr>
              <tr>
                <td>{t("body.legalBases.content.table.purposes.col12")}</td>
                <td>{t("body.legalBases.content.table.legalBase.col12")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>{t("body.legalBases.content.content")}</p>

        <h2>{t("body.aboutShareAssignment.title")}</h2>
        <p>{t("body.aboutShareAssignment.content.firstParagraph")}</p>
        <p>{t("body.aboutShareAssignment.content.secondParagraph")}</p>
        <p>{t("body.aboutShareAssignment.content.thirdParagraph")}</p>
        <ul className="list-disc list-inside ml-6 my-4">
          <li>{t("body.aboutShareAssignment.content.list.item1")}</li>
          <li>{t("body.aboutShareAssignment.content.list.item2")}</li>
          <li>{t("body.aboutShareAssignment.content.list.item3")}</li>
          <li>{t("body.aboutShareAssignment.content.list.item4")}</li>
          <li>{t("body.aboutShareAssignment.content.list.item5")}</li>
          <li>{t("body.aboutShareAssignment.content.list.item6")}</li>
          <li>{t("body.aboutShareAssignment.content.list.item7")}</li>
        </ul>
        <p>{t("body.aboutShareAssignment.content.fourthParagraph")}</p>
        <p>{t("body.aboutShareAssignment.content.fifthParagraph")}</p>

        <h2>{t("body.informationSecurity.title")}</h2>
        <p>{t("body.informationSecurity.content.firstParagraph")}</p>
        <p>{t("body.informationSecurity.content.secondParagraph")}</p>

        <h2>{t("body.holdersRights.title")}</h2>
        <p>
          {t("body.holdersRights.content.firstParagraph.content")}{" "}
          <Link className="text-teal-500" href="mailto:dpo@cardenas.com.br">
            {t("body.holdersRights.content.firstParagraph.link")}
          </Link>
          .{" "}
        </p>
        <p>{t("body.holdersRights.content.list.title")}</p>
        <ul className="list-disc list-inside ml-6 my-4">
          <li>{t("body.holdersRights.content.list.item1")}</li>
          <li>{t("body.holdersRights.content.list.item2")}</li>
          <li>{t("body.holdersRights.content.list.item3")}</li>
          <li>{t("body.holdersRights.content.list.item4")}</li>
          <li>{t("body.holdersRights.content.list.item5")}</li>
          <li>{t("body.holdersRights.content.list.item6")}</li>
          <li>{t("body.holdersRights.content.list.item7")}</li>
        </ul>
        <p>{t("body.holdersRights.content.secondParagraph")}</p>
        <p>{t("body.holdersRights.content.thirdParagraph")}</p>
        <p>
          {t("body.holdersRights.content.fourthParagraph.content1")}{" "}
          <Link className="text-teal-500" href="mailto:dpo@cardenas.com.br">
            {t("body.holdersRights.content.fourthParagraph.link")}
          </Link>
          {t("body.holdersRights.content.fourthParagraph.content2")}
        </p>

        <h2>{t("body.endTreatment.title")}</h2>
        <p>{t("body.endTreatment.content.firstParagraph")}</p>
        <p>{t("body.endTreatment.content.secondParagraph")}</p>
        <p>{t("body.endTreatment.content.thirdParagraph")}</p>

        <h2>{t("body.dpo.title")}</h2>
        <p>{t("body.dpo.content.firstParagraph")}</p>
        <p>{t("body.dpo.content.secondParagraph")}</p>
        <p>
          {t("body.dpo.content.thirdParagraph.content1")}(
          <Link
            className="text-teal-500"
            href="http://www.dpoexpert.com.br"
            target="_blank"
          >
            {t("body.dpo.content.thirdParagraph.link1")}
          </Link>
          ) {t("body.dpo.content.thirdParagraph.content2")}{" "}
          <Link className="text-teal-500" href="mailto:dpo@cardenas.com.br">
            {t("body.dpo.content.thirdParagraph.link2")}
          </Link>
        </p>
        <p>{t("body.dpo.content.fourthParagraph")}</p>

        <h2>{t("body.dpo.content.fifthParagraph")}</h2>
        <p>{t("body.dpo.content.sixthParagraph")}</p>
        <p>{t("body.dpo.content.seventhParagraph")}</p>
      </div>
    </div>
  );
}
