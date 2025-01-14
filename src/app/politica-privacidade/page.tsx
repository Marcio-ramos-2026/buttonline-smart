import Image from "next/image";
import styles from "./style.module.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PolicyPrivacy() {
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
        <Link href={'login'}>
          <Button>Voltar</Button>
        </Link>

        <h1 className="text-2xl font-bold	">Política de privacidade</h1>
        <p>Atualizado em 04 de abril de 2024.</p>

        <h2>1. Declaração de Privacidade</h2>
        <p>
          A <strong>KIT BUTTON/CARDENAS</strong> sabe o quanto é importante
          conhecer e estar seguro sobre a utilização dos dados pessoais que tem
          em seu poder. Por isso, nos preocupamos em esclarecer e explicar nosso
          Aviso de Privacidade.
        </p>

        <h2>2. Quais são as informações pessoais que coletamos</h2>
        <p>
          As informações pessoais que obtemos podem ser coletadas das seguintes
          formas:
        </p>
        <p>
          <strong>Site:</strong> Informações pessoais são coletadas quando o
          usuário interage em nosso site por meio do preenchimento de formulário
          de contato, bem como ao divulgar depoimentos. Essas informações
          pessoais incluem, dentre outras, o nome, e-mail e telefone. O usuário
          do nosso portal não é obrigado em hipótese alguma a fornecer qualquer
          dado pessoal para navegar nas páginas do site, exceto no caso de
          aquisição de produtos, de modo que qualquer informação é fornecida por
          livre e espontânea vontade. Somente é necessária a coleta de dados
          básicos quando o usuário desejar o retorno de seu contato. Todas as
          informações pessoais são colhidas de maneira justa e não invasiva, com
          o seu consentimento voluntário. As informações pessoais coletadas são
          acessíveis somente aqueles que tenham necessidade de conhecê-las para
          a execução de atividades pertinentes, respeitada a finalidade para a
          qual tenham sido fornecidas.
        </p>
        <p>
          <strong>Cadastro:</strong> Informações pessoais são ainda coletadas
          para cadastro e acesso à área do cliente. Os dados são necessários
          para identificar o usuário e permitir que ele adquira produtos através
          de nosso website, bem como para emissão de nota fiscal eletrônica. Os
          dados pessoais são coletados para que possamos processar, gerenciar,
          entregar suas compras, trocar ou enviar de volta algum produto caso o
          cliente assim deseje. Os dados coletados para cadastro são CPF/CNPJ,
          nome, sobrenome, e-mail, telefone e endereço. Caso o titular opte por
          preencher, poderão ser coletadas a data de nascimento e o gênero.
        </p>
        <p>
          Podem ser coletados dados pessoais de acordo com a forma de pagamento
          escolhida, como número de cartão de crédito ou débito, CPF, nome
          completo e endereço de cobrança. As informações de cartão de crédito
          não são armazenadas em nossos sistemas e o processamento de dados para
          aprovação é feito diretamente pelas administradoras de cartões e pelos
          bancos. Podem também ser coletados outros dados pessoais relacionados
          a conta bancária do cliente, caso haja a necessidade de estorno dos
          valores pagos.
        </p>
        <p>
          {" "}
          Destacamos que o usuário não poderá adquirir produtos pelo site sem um
          cadastro. Desse modo, a coleta das informações é condição para o
          fornecimento dos nossos produtos por meio do e-commerce. Ao se
          cadastrar o usuário poderá incluir voluntariamente seu e-mail para
          recebimento de mensagens eletrônicas contendo informações, promoções e
          novidades. O cancelamento da assinatura de newsletters poderá ser
          realizado a qualquer momento, clicando no link de cancelamento contido
          no próprio corpo dos e-mails.
        </p>

        <p>
          <strong>Buttonline:</strong> para efetivar o acesso ao sistema,
          disponibilizamos uma ferramenta de cadastro em{" "}
          <Link
            className="text-teal-500"
            href="https://buttonline.com.br/"
            target="_blank"
          >
            https://buttonline.com.br/
          </Link>
          , a qual apresenta ao usuário um formulário e coleta os seguintes
          dados pessoais: nome completo e e-mail.
        </p>
        <p>
          <strong>Newsletter:</strong> O Usuário pode optar por receber nosso
          newsletter, contendo cupons, descontos e promoções, por meio do
          preenchimento do e-mail em formulário próprio em nosso site. O usuário
          pode, a qualquer momento, deixar de receber nossas comunicações
          clicando no link de cancelamento contido no rodapé dos próprios
          e-mails enviados.
        </p>
        <p>
          <strong>Canais de atendimento:</strong> O usuário poderá entrar em
          contato por meio de contato. Os dados pessoais são coletados com o
          objetivo de identificar o usuário, bem como por meio físico,
          telefônico, e-mail ou WhatsApp para atender sua solicitação. Esses
          podem incluir, dentre outros, o nome, e-mail e telefone. Além destes,
          coletamos qualquer dado pessoal que seja informado espontaneamente
          pelo usuário.
        </p>
        <p>
          <strong>Cookies:</strong> Dados pessoais podem ser coletados por meio
          de cookies. Para mais informações, consulte nossa{" "}
          <Link
            className="text-teal-500"
            href="politica-cookies"
            target="_blank"
          >
            Política de Cookies.
          </Link>
        </p>
        <p>
          <strong>Candidatos a vagas de emprego:</strong> Podemos ter acesso a
          informações pessoais de candidatos a vagas de emprego, tais como nome
          completo, telefone, e-mail e quaisquer outras informações fornecidas
          voluntariamente pelo candidato.
        </p>
        <p>
          <strong>Empregados:</strong> Quanto aos dados pessoais coletados de
          nossos empregados, estes são necessários para que seja efetuado o
          registro do empregado, em atendimento à legislação trabalhista e
          execução do contrato de trabalho.
        </p>

        <h2>3. Mídias Sociais</h2>
        <p>
          A <strong>KIT BUTTON / CARDENAS</strong> se utiliza também da Mídia
          Social para se comunicar e interagir com seus clientes e consumidores
          por meio de websites de terceiros como, por exemplo, o Instagram,
          Facebook, LinkedIn e YouTube. Estes websites de terceiros são uma
          tecnologia baseada na Internet que não é operada ou controlada pela{" "}
          <strong>KIT BUTTON / CARDENAS</strong>. Ao interagir, compartilhar ou
          “Curtir” a página da <strong>KIT BUTTON / CARDENAS</strong>
          no Instagram, Facebook, LinkedIn, YouTube ou outra mídia social, você
          poderá revelar determinadas informações pessoais a{" "}
          <strong>KIT BUTTON / CARDENAS</strong> ou a terceiros.
        </p>
        <p>
          Usamos os “botões sociais” para permitir que os nossos usuários
          compartilhem ou marquem páginas da web. São botões de sites terceiros
          de mídias sociais, e que podem registrar informações sobre suas
          atividades na internet, incluindo este site. Por favor, reveja os
          respectivos termos de uso e Avisos de Privacidade dessas plataformas
          para entender exatamente como eles usam suas informações, como optar
          por não receber ou excluir tais informações.
        </p>
        <p>
          A quantidade de informações pessoais visíveis dependerá das suas
          próprias configurações de privacidade no Instagram, Facebook,
          LinkedIn, YouTube e demais mídias sociais.
        </p>

        <h2>4. Finalidades e bases legais</h2>
        <p>
          Relacionamos a seguir as finalidades e bases legais dos tratamentos de
          dados da <strong>KIT BUTTON / CARDENAS</strong>:
        </p>

        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fins</th>
                <th>Base legal</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  Cumprir com termos e condições estabelecidos em contrato
                </td>
                <td>
                  Necessário para execução de contrato no qual o titular de
                  dados pessoais seja parte.
                </td>
              </tr>
              <tr>
                <td>
                  Facilitar a comunicação com você (inclusive em casos de
                  emergência e para fornecer a você informações solicitadas).
                </td>
                <td>
                  Justifica-se com base em nossos interesses legítimos de
                  assegurar comunicação e gestão de emergências adequadas na
                  organização.
                </td>
              </tr>
              <tr>
                <td>Cumprir requisitos legais.</td>
                <td>
                  Necessário para a conformidade com uma obrigação legal à qual
                  estamos sujeitos.
                </td>
              </tr>
              <tr>
                <td>
                  Monitorar o uso que você faz dos nossos sistemas (incluindo
                  monitorar o uso do nosso site e de quaisquer aplicativos e
                  ferramentas que você utilizar).
                </td>
                <td>
                  Justifica-se com base nos nossos interesses legítimos de
                  evitar não conformidades e proteger nossa reputação.
                </td>
              </tr>
              <tr>
                <td>
                  Escuta social (identificando e analisando o que está sendo
                  dito sobre a <strong>KIT BUTTON / CARDENAS</strong> nas mídias
                  sociais [somente conteúdo acessível publicamente] a fim de
                  perceber sentimento, intenção, disposição e tendências de
                  mercado, além das necessidades de nossos stakeholders para,
                  dessa forma, melhorar nossos serviços.)
                </td>
                <td>
                  Justifica-se com base em nossos legítimos interesses em
                  proteger nossos ativos e nossa marca nas mídias sociais.
                </td>
              </tr>
              <tr>
                <td>
                  Melhorar a segurança e o funcionamento do nosso website, redes
                  e informações.
                </td>
                <td>
                  Justifica-se com base em nossos legítimos interesses de
                  assegurar que você terá uma experiência de usuário excelente e
                  que nossas redes e informações são seguras.
                </td>
              </tr>
              <tr>
                <td>Administrar benefícios aos empregados</td>
                <td>
                  Justifica-se com base no consentimento do empregado, caso seja
                  de seu interesse o recebimento de determinado benefício.
                </td>
              </tr>
              <tr>
                <td>
                  Oferecer nossos produtos e serviços para você (a menos que
                  você tenha mostrado objeção em relação a tal tratamento).
                </td>
                <td>
                  Justifica-se com base em nossos legítimos interesses de
                  promover nosso negócio.
                </td>
              </tr>
              <tr>
                <td>Administrar benefícios aos empregados.</td>
                <td>
                  Justifica-se com base no consentimento do empregado, caso seja
                  de seu interesse o recebimento de determinado benefício.
                </td>
              </tr>
              <tr>
                <td>
                  Identificação e autenticação para acesso as dependências das
                  unidades da <strong>KIT BUTTON / CARDENAS</strong> por meio de
                  imagens e gravações de terceiros, colaboradores e visitantes.
                </td>
                <td>
                  Justifica-se na proteção da vida ou da incolumidade física dos
                  titulares ou de terceiros.
                </td>
              </tr>
              <tr>
                <td>Monitoramento interno das dependências da empresa.</td>
                <td>Justifica-se com base em nossos legítimos interesses.</td>
              </tr>
              <tr>
                <td>
                  Entrega de informações necessárias aos órgãos governamentais
                </td>
                <td>Para cumprimento de uma obrigação legal</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Apenas nos baseamos em nosso legítimo interesse para finalidades
          específicas. Estes tratamentos de dados pessoais não se sobrepõem de
          forma alguma aos interesses, direitos e liberdades dos titulares de
          dados pessoais.
        </p>

        <h2>5. Sobre o compartilhamento e cessão de informações</h2>
        <p>
          A <strong>KIT BUTTON/CARDENAS</strong> não tem como prática a
          divulgação de informações que podem identificar o usuário e jamais
          compartilha informações ou vende e aluga esses dados pessoais a
          terceiros. Estes dados são de uso exclusivo interno da empresa para
          atingir as finalidades expressas no item anterior.
        </p>
        <p>
          dados pessoais a terceiros. Estes dados são de uso exclusivo interno
          da empresa para atingir as finalidades expressas no item anterior.
        </p>
        <p>
          Os dados poderão ser compartilhados com terceiros apenas nas seguintes
          condições:
        </p>
        <ul className="list-disc list-inside ml-6 my-4">
          <li>
            Mediante decisão judicial ou solicitação pelos órgãos de
            fiscalização governamentais;
          </li>
          <li>
            Dados transferidos para órgãos públicos para atender a legislação
            vigente, por exemplo dados pessoais que constem das notas fiscais
            eletrônicas e respectivos XMLs, ou dados dos nossos colaboradores
            necessários para o pagamento do INSS ou FGTS;
          </li>
          <li>
            Dados transferidos para prestadores de serviço de contabilidade ou
            recursos humanos, para o atendimento de obrigações fiscais e
            trabalhistas;
          </li>
          <li>
            Dados transferidos para instituições financeiras para viabilizar
            opções de pagamento aos nossos clientes, ou para pagamento de
            salários aos nossos colaboradores e prestadores;
          </li>
          <li>
            Dados compartilhados com parceiros, operadores e fornecedores de
            serviços, representantes, distribuidores internacionais e que
            participam, direta ou indiretamente, do desenvolvimento das
            atividades comerciais da <strong>KIT BUTTON/CARDENAS</strong>, tais
            como cobranças, processos de pagamento, plataformas de pagamento
            online, plataformas de venda (e-commerce), serviços de atendimento
            ao cliente, envio de e-mails, propaganda e marketing, segurança e
            monitoramento de desempenho, processamento e cumprimento de ordens e
            transações, verificação de informações cadastrais de consumidores,
            pesquisa, guarda de dados, auditoria e processamento de dados
          </li>
          <li>
            Dados transferidos para fins de execução do contrato, bem como para
            a proteção dos interesses da <strong>KIT BUTTON/CARDENAS</strong> em
            qualquer tipo de conflito, incluindo ações judiciais;
          </li>
          <li>
            Em caso de operações societárias como fusão, aquisição,
            transformação, cisão, ou uma venda parcial ou total de ativos,
            poderemos compartilhar, divulgar ou transferir todos os dados dos
            titulares para a organização sucessora.
          </li>
        </ul>
        <p>
          Alguns dos prestadores de serviços mencionados acima podem estar
          localizados no exterior e, nesse caso, a{" "}
          <strong>KIT BUTTON/CARDENAS</strong> adota salvaguardas adicionais
          para a garantia de um nível adequado de proteção de dados pessoais, de
          acordo com o disposto legislação brasileira pertinente.
        </p>
        <p>
          Nas operações de compartilhamento de seus dados pessoais com
          Operadores de dados, exigiremos que sejam tratados de acordo com
          nossas instruções, na qualidade de agente Controlador dessas
          informações, inclusive perante outros agentes de tratamento que
          intervierem na cadeia de tratamento de dados, incluindo Suboperadores.
        </p>

        <h2>6. Segurança da Informação</h2>
        <p>
          Para assegurar-se de que as suas informações pessoais estão seguras,
          nós comunicamos as nossas diretrizes de privacidade e segurança aos
          empregados e parceiros comerciais e seguimos estritamente as medidas
          de precaução com relação à privacidade dentro da empresa.
        </p>
        <p>
          Nós nos empenhamos em proteger as suas informações pessoais, e aquelas
          confiadas a nós pelos nossos clientes, por meio de medidas físicas,
          técnicas e organizacionais que visem reduzir os riscos de perda, mau
          uso, acesso não autorizado, divulgação e alteração indevida destes
          dados.
        </p>

        <h2>7. Direitos dos Titulares</h2>
        <p>
          Os Titulares de dados pessoais têm alguns direitos no que se refere
          aos seus dados pessoais e podem exercê-los clicando aqui para acessar
          o Formulário de Requisição de Dados (DSAR) ou por meio do e-mail:{" "}
          <Link className="text-teal-500" href="mailto:dpo@cardenas.com.br">
            dpo@cardenas.com.br
          </Link>
          .{" "}
        </p>
        <p>São direitos dos titulares:</p>
        <ul className="list-disc list-inside ml-6 my-4">
          <li>Confirmação da existência de tratamento de dados pessoais;</li>
          <li>
            Acesso aos dados pessoais, nos termos da legislação aplicável;
          </li>
          <li>
            Correção de dados pessoais incompletos, inexatos ou desatualizados;
          </li>
          <li>Portabilidade dos dados pessoais;</li>
          <li>
            Exclusão de dados pessoais, quando este forem tratados com base no
            consentimento do titular ou quando os dados forem desnecessários,
            excessivos ou tratados em desconformidade com a legislação
            aplicável;
          </li>
          <li>
            Solicitação de informações sobre o uso compartilhado de dados
            pessoais;
          </li>
          <li>Revogação do consentimento, quando aplicável.</li>
        </ul>
        <p>
          A <strong>KIT BUTTON/CARDENAS</strong> sempre avaliará a melhor forma
          de cumprir a solicitação de exercício de algum de seus direitos. No
          entanto, a KIT BUTTON/CARDENAS poderá deixar de atender a sua
          solicitação, total ou parcialmente, em situações específicas
          resguardadas pela legislação, como, por exemplo, para o cumprimento de
          uma obrigação legal ou um o contrato que mantém com você.
        </p>
        <p>
          Ressaltamos a importância de manter seus dados pessoais precisos e
          atualizados. Para tanto, mantenha a{" "}
          <strong>KIT BUTTON/CARDENAS</strong> sempre informada se seus dados
          pessoais mudarem ou estiverem incorretos.
        </p>
        <p>
          Por motivos de segurança, para as requisições que sejam feitas por
          meio do e-mail{" "}
          <Link className="text-teal-500" href="mailto:dpo@cardenas.com.br">
            dpo@cardenas.com.br
          </Link>
          , a solicitação será atendida quando tivermos certeza da identidade do
          usuário. Sendo assim, poderemos solicitar dados ou informações
          adicionais para a confirmação da identidade e da autenticidade do
          titular. Estes dados e informações serão protegidos durante período de
          armazenamento e eliminados, tão logo esgotada a finalidade de
          confirmação da identidade do titular.
        </p>

        <h2>8. Término de Tratamento</h2>
        <p>
          Este Aviso de Privacidade se aplica às circunstâncias acima
          mencionadas durante todo o período em que os dados pessoais sejam
          armazenados. Nós mantemos suas informações: (a) pelo tempo exigido por
          lei; (b) até o término do tratamento de dados pessoais, conforme
          mencionado abaixo; ou (c) pelo tempo necessário para resguardar os
          direitos da empresa. Assim, trataremos seus dados, por exemplo,
          durante os prazos prescricionais aplicáveis ou enquanto necessário
          para cumprimento de obrigação legal ou regulatória.
        </p>
        <p>
          O término do tratamento de dados pessoais ocorrerá nos seguintes
          casos: (a) quando a finalidade para qual o dado pessoal foi coletado
          for alcançada, e/ou os dados pessoais coletados deixarem de ser
          necessários ou pertinentes ao alcance de tal finalidade; (b) quando o
          Titular solicitar a exclusão de seus dados; e (c) quando houver uma
          determinação legal neste sentido. Nos casos de término de tratamento
          de dados pessoais, ressalvadas as hipóteses estabelecidas pela
          legislação aplicável ou pelo presente Aviso de Privacidade, os dados
          pessoais serão eliminados.
        </p>
        <p>
          Nos casos de término de tratamento de dados pessoais, ressalvadas as
          hipóteses estabelecidas pela legislação aplicável ou pela presente
          Política de Privacidade, os dados pessoais serão eliminados.
        </p>

        <h2>9. Encarregado de Dados Pessoais (DPO)</h2>
        <p>
          A <strong>KIT BUTTON/CARDENAS</strong> disponibiliza abaixo os dados
          de contato do Encarregado de Dados Pessoais (DPO), sendo este o
          responsável por atender toda e qualquer solicitação por parte dos
          titulares ou da Autoridade Nacional, que estejam relacionados com
          dados pessoais.
        </p>
        <p>
          Para qualquer dúvida, solicitação ou reclamação referente ao
          tratamento de dados pessoais, favor entrar em contato com o nosso
          Encarregado de Dados Pessoais:
        </p>
        <p>
          DPO EXPERT® (
          <Link
            className="text-teal-500"
            href="http://www.dpoexpert.com.br"
            target="_blank"
          >
            www.dpoexpert.com.br
          </Link>
          ) – contato:{" "}
          <Link className="text-teal-500" href="mailto:dpo@cardenas.com.br">
            dpo@cardenas.com.br
          </Link>
        </p>
        <p>
          Se, apesar do nosso compromisso e esforços para proteger seus dados,
          você achar que seus direitos de proteção de dados não foram atendidos,
          solicitamos que entre em contato com o nosso DPO. Além disso você tem
          o direito, a qualquer momento, de registrar uma queixa diretamente com
          a Autoridade Nacional de Proteção de Dados, caso entenda que os
          direitos sobre os seus dados pessoais foram infringidos.
        </p>

        <h2>
          Apesar de nosso Aviso de Privacidade ter sido apresentado de forma
          clara, concisa e objetiva, não hesite em consultar o DPO, caso
          sobrevenham dúvidas sobre este importante documento ou mesmo sobre as
          atividades de tratamento de dados pessoais que realizamos.
        </h2>
        <p>
          Apesar de nossa Política de Privacidade ter sido apresentado
          apresentada de forma clara, concisa e objetiva, não hesite em
          consultar o DPO, caso sobrevenham dúvidas sobre este importante
          documento ou mesmo sobre as atividades de tratamento de dados pessoais
          que realizamos.
        </p>
        <p>
          A <strong>KIT BUTTON/CARDENAS</strong> se reserva no direito de
          atualizar ou modificar este Aviso, em qualquer época e sem aviso
          prévio. No entanto, publicaremos sempre a nova versão revisada em
          nosso website. Caso existam alterações na forma em que tratamos dados
          pessoais, você será informado para verificar se pretende continuar
          utilizando nossos serviços.
        </p>
      </div>
    </div>
  );
}
