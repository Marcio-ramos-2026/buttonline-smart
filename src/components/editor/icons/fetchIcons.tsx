"use server";

import { fetchIcons } from "@/lib/db";

export const FetchIcons = async () => {
  const icons = await fetchIcons();

  console.log("iiii", icons);
  return <></>;
};
