import Image from "next/image";
import styles from "./style.module.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PolicyCookies() {
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
          <Button>Voltar</Button>
        </Link>

        <h1 className="text-2xl font-bold	">Política de cookies</h1>
        <p>Atualizada em 12 de abril de 2024.</p>

        <p>
          Nosso site usa cookies para melhorar o desempenho e aprimorar a sua
          experiência de navegação. Certas áreas do nosso site também utilizam
          cookies para entender mais sobre você e para que possamos oferecer uma
          experiência de navegação mais personalizada. Ao continuar a usar este
          website, você toma conhecimento de que nós poderemos instalar cookies
          ou outras tecnologias similares em seu equipamento, inclusive
          dispositivo móvel.
        </p>

        <h2>O que são cookies?</h2>
        <p>
          Cookies são pequenos arquivos, contendo algumas poucas informações
          sobre seu acesso, e que são armazenados em seu dispositivo quando você
          visita um site. O termo "cookie" pode ser usado para descrever uma
          série de tecnologias, incluindo, mas não se limitando a pixel tags,
          web beacons e identificadores de dispositivo móvel.
        </p>
        <p>
          Estes arquivos permitem ao site reconhecer o seu equipamento e
          registrar sua interação nas páginas do próprio site. Eles são
          amplamente utilizados na web para melhorar a experiência do usuário,
          fornecer informações aos proprietários do site e oferecer
          funcionalidades avançadas.
        </p>
        <p>
          Esses cookies são enviados de volta ao site de origem a cada visita
          subsequente ou a outros sites que reconhecem esse cookie. Os cookies
          permitem que o site reconheça seu dispositivo e se lembre de
          informações importantes, como suas preferências, itens no carrinho de
          compras e dados de login.
        </p>

        <h2>Por que usamos cookies?</h2>
        <p>
          Os cookies exercem muitas tarefas diferentes, como otimizar sua
          navegação pelas páginas, lembrar suas preferências e personalizar sua
          experiência durante a navegação. Eles ainda ajudam a garantir que os
          anúncios e outros conteúdos que você acessar online sejam relevantes
          para você. Além disso, são utilizados para coletar dados estatísticos
          que são utilizados para implementar melhorias em nosso site e garantir
          a melhor experiência do usuário.
        </p>

        <h2>Como os Cookies são utilizados pela Buttonline - Cardenas?</h2>
        <p>A Buttonline - Cardenas utiliza os seguintes tipos de Cookies:</p>
        <p>
          <strong>Cookies Essenciais</strong> - Os cookies essenciais são
          necessários para o funcionamento dos Sites e prestação dos serviços a
          você, com base no nosso legítimo interesse. Sem estes cookies, os
          Sites não funcionarão tão bem como nós gostaríamos e podemos não ser
          capazes de fornecer determinados serviços ou recursos a eles
          associados.
        </p>
        <p>
          Dentro desta categoria, os cookies podem ser classificados como
          cookies “de sessão” ou “persistentes”. Cookies “de sessão” são
          temporários e, uma vez que você fechar a janela do navegador, eles
          serão eliminados de seu dispositivo. Já, os “persistentes” permanecem
          no seu dispositivo até sua data de expiração, ou até que você os
          exclua, e são usados pelo site para reconhecer seu dispositivo em suas
          visitas subsequentes.
        </p>

        <h2>Nós usamos cookies de terceiros?</h2>
        <p>
          Alguns cookies que usamos são de outras empresas que fornecem serviços
          em nosso site, como ferramentas de análise ou plugins de mídia social,
          como o Google Analytics. Estas companhias usam códigos de programação
          para coletar informações sobre sua interação com nossos sites, como as
          páginas que você visita, os links nos quais você clica e por quanto
          tempo você permanece conectado em nossos sites.
        </p>

        <h2>Que outras tecnologias de rastreamento utilizamos?</h2>
        <p>
          Podemos também usar web beacons (inclusive pixels de conversão) ou
          outras tecnologias para fins semelhantes e podemos incluí-los em
          nossos sites, em mensagens de e-mail de marketing ou em nossos
          boletins informativos e websites de afiliadas, para determinar se as
          mensagens foram abertas e se os links foram clicados. Os web beacons
          não instalam informações em seu dispositivo, mas podem trabalhar em
          conjunto com os cookies para monitorar a atividade do site. Pixels de
          conversão são pequenos códigos localizados numa página web em
          particular que são alterados quando alguém visita a página, resultando
          num aumento da contagem de conversão.
        </p>

        <h2>E se eu não quiser os cookies?</h2>
        <p>
          Ao utilizar nosso site, você concorda que nós podemos utilizar cookies
          em seu dispositivo. No seu primeiro acesso, surgirá um “banner de
          cookies” informando sobre a utilização de cookies em nosso site. As
          configurações quanto ao uso de cookies podem ser alteradas em seu
          navegador. Consulte a seção de ajuda do seu navegador para obter
          informações sobre como alterar as configurações de cookies. Lembre-se
          de que a desativação de cookies pode afetar negativamente a
          funcionalidade de certos recursos em nosso site.
        </p>
        <p>
          Caso tenha alguma pergunta acerca deste Política de Cookies, por favor
          contate-nos por meio do e-mail:{" "}
          <Link className="text-teal-500" href="mailto:dpo@cardenas.com.br">
            dpo@cardenas.com.br
          </Link>
        </p>
        <p>Cookies que utilizamos em nosso site:</p>

        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              <tr className="bg-teal-500 ">
                <th
                  colSpan={4}
                  className=" text-white py-4 "
                  style={{ textAlign: "center" }}
                >
                  Cookies essenciais
                </th>
              </tr>

              <tr>
                <th>Nome</th>
                <th>Provedor</th>
                <th>Função</th>
                <th>Prazo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PHPSESSID</td>
                <td>
                  <Link
                    className="text-teal-500"
                    href="buttonline.com.br"
                    target="_blank"
                  >
                    buttonline.com.br
                  </Link>
                </td>
                <td style={{ minWidth: 200 }}>
                  Este cookie é nativo de aplicações PHP. O cookie armazena e
                  identifica o ID de sessão exclusivo de um usuário para
                  gerenciar as sessões do usuário no site. O cookie é um cookie
                  de sessão e será eliminado quando todas as janelas do
                  navegador forem fechadas.
                </td>
                <td>Sessão</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
