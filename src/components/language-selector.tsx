"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { langs } from "@/lib/langs"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import {setUserLocale} from '@/i18n/locale';



export default function LanguageSelector() {
  const t = useTranslations('language');
  const locale = useLocale()  

  const [selectedLanguage, setSelectedLanguage] = useState<typeof langs[0] | undefined>(() => {
    return langs.find((lang) => lang.locale === locale) ?? langs[0];
  });

  const selectLang = (lang:typeof langs[0]) => {
    setSelectedLanguage(lang)
    setUserLocale(lang)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowDown className="h-4 w-4" />
          <Image
                src={`/flags/${selectedLanguage?.flag}`}
                alt={t(selectedLanguage?.locale)}
                width={24}
                height={24}
                className="rounded-full"
                style={{ aspectRatio: "24/24", objectFit: "cover" }}
            />
          <span className="font-medium">{t(selectedLanguage?.locale)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
           {langs.map((lang)=>{
            return (
                <DropdownMenuItem key={lang.locale} onClick={() => selectLang(lang)}>
                    <div className="flex items-center gap-2">
                        <Image
                            src={`/flags/${lang.flag}`}
                            alt={t(lang.locale)}
                            width={24}
                            height={24}
                            className="rounded-full"
                            style={{ aspectRatio: "24/24", objectFit: "cover" }}
                        />
                        <span>{t(lang.locale)}</span>
                    </div>
                </DropdownMenuItem>
            )
           })} 
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

//@ts-ignore
function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}