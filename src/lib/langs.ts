export const langs = [
    {name:'Portuguese',locale:'pt-BR',flag:'brasil.svg'},
    {name:'English',locale:'en',flag:'usa.svg'},
    {name:'Espanish',locale:'en-ES',flag:'argentina.svg'},
] as const

export type ILocaleLang = (typeof langs[number])["locale"];

type DynamicLangMessage<T extends string> = Record<T, string | number | Record<string, any>>;

export type EmailMessageLang = {
    [key in ILocaleLang]: DynamicLangMessage<keyof Record<string,any>>;
};

