'use client'

import { fetchIconsTeste } from "@/lib/db";
import { useEffect, useState } from "react";
import { FetchIcons } from "./fetchIcons";

export const TabIcons = ({ content }: { content: string }) => {
  const [teste, setTeste] = useState<any>()

  // const batata = fetchIconsTeste()
  // useEffect(() => {
  //   fetchIconsTeste()?.then(res => setTeste(res));
  // }, [])

  // console.log('teste', batata)

  return (
    <>
      {/* <FetchIcons /> */}
      <h1>{content}</h1>
    </>
  );
};
