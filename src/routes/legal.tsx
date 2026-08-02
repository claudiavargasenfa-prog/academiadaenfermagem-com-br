import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Scale, Lock, FileSignature, CheckCircle2 } from "lucide-react";

import { AppShell, Card, PageHeader } from "@/components/AppShell";
import {
  LEGAL_DOC_VERSION,
  hasAcceptedLegalLocally,
  recordLegalAcceptance,
} from "@/lib/legal";

const TITLE = "Documentos Legais — Academia da Enfermagem";
const DESC =
  "Termos de Uso, Aviso Legal, Política de Privacidade (LGPD) e Termo de Aceite do aplicativo Academia da Enfermagem.";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/legal" }],
  }),
  component: LegalPage,
});

function H2({ icon: Icon, id, children }: { icon: any; id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-3 flex scroll-mt-24 items-center gap-2 font-display text-lg font-extrabold text-foreground">
      <Icon className="h-5 w-5 text-gold" />
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-4 font-display text-sm font-extrabold text-foreground">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function LegalPage() {
  const [accepted, setAccepted] = useState(() => hasAcceptedLegalLocally());
  const [busy, setBusy] = useState(false);

  async function accept() {
    setBusy(true);
    await recordLegalAcceptance("pagina_legal");
    setBusy(false);
    setAccepted(true);
  }

  return (
    <AppShell publicRoute hideReferences>
      <PageHeader
        eyebrow="Documentos legais"
        title="Termos de Uso, Aviso Legal, Política de Privacidade e Termo de Aceite"
        description={`Academia da Enfermagem · Claudia Vargas · Versão ${LEGAL_DOC_VERSION} — 02 de agosto de 2026`}
      />

      <Card className="mb-4 border-emerald-900/20 bg-emerald-50/60">
        <p className="text-xs leading-relaxed text-emerald-950">
          <strong>Aviso Legal:</strong> este aplicativo é uma ferramenta técnico-científica de{" "}
          <strong>apoio à decisão clínica</strong>. Não substitui o julgamento técnico do
          profissional, o exame clínico do paciente, as fontes oficiais (COFEN, COREN, Ministério da
          Saúde, ANVISA) nem os protocolos institucionais. A responsabilidade pela conduta clínica é
          exclusivamente do profissional de enfermagem assistente.
        </p>
      </Card>

      <Card className="mb-4">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-gold">Índice</p>
        <ul className="mt-2 grid gap-1 text-sm font-semibold text-primary sm:grid-cols-2">
          <li><a href="#termos" className="hover:underline">Parte I — Termos de Uso</a></li>
          <li><a href="#aviso" className="hover:underline">Parte II — Aviso Legal</a></li>
          <li><a href="#privacidade" className="hover:underline">Parte III — Política de Privacidade (LGPD)</a></li>
          <li><a href="#aceite" className="hover:underline">Parte IV — Termo de Aceite</a></li>
        </ul>
      </Card>

      {/* PARTE I */}
      <Card className="mb-4">
        <H2 icon={Scale} id="termos">Parte I — Termos de Uso e Aceite das Diretrizes da Plataforma</H2>

        <H3>1.1 Do Objeto</H3>
        <P>
          O aplicativo <strong>Academia da Enfermagem</strong> é uma ferramenta técnico-científica de
          apoio à decisão clínica, destinada exclusivamente a estudantes de enfermagem e profissionais
          de enfermagem, para consulta durante o plantão e atividades assistenciais. O conteúdo
          disponibilizado é elaborado com rigor técnico, fundamentado em referências oficiais,
          incluindo, mas não se limitando a, normativas do Conselho Federal de Enfermagem (COFEN),
          Conselhos Regionais de Enfermagem (COREN), Ministério da Saúde e Agência Nacional de
          Vigilância Sanitária (ANVISA), além de literatura técnico-científica consolidada e da
          experiência profissional da desenvolvedora. Fica expressamente consignado que o aplicativo{" "}
          <strong>NÃO</strong> substitui o julgamento técnico, o raciocínio clínico, o exame físico do
          paciente nem a responsabilidade profissional do enfermeiro, que permanece integralmente com
          o profissional assistente, nos termos da Lei nº 7.498/86 e da Resolução COFEN nº 564/2017.
        </P>

        <H3>1.2 Da Aceitação dos Termos</H3>
        <P>
          Ao baixar, acessar ou utilizar o aplicativo, o usuário declara ter lido, compreendido e
          aceitado integralmente estes Termos de Uso e a Política de Privacidade. A continuidade do
          uso após eventuais alterações nos textos legais implica renovação automática do aceite por
          parte do usuário. A versão vigente e atualizada dos Termos estará permanentemente
          disponível para consulta no interior da plataforma.
        </P>

        <H3>1.3 Do Público-Alvo e Condições de Uso</H3>
        <P>
          O uso da Academia da Enfermagem é restrito ao âmbito profissional e educacional da
          enfermagem. É terminantemente vedado o uso por pessoas leigas para fins de autodiagnóstico
          ou autotratamento. Ao utilizar a plataforma, o usuário declara e garante possuir a condição
          de estudante de enfermagem ou de profissional de enfermagem devidamente habilitado.
        </P>

        <H3>1.4 Da Natureza do Conteúdo e Limitação de Responsabilidade</H3>
        <P>
          O conteúdo disponibilizado possui caráter meramente informativo e de apoio à decisão, não
          constituindo prescrição, protocolo obrigatório ou substitutivo das fontes oficiais e dos
          protocolos internos de cada instituição de saúde. A desenvolvedora não se responsabiliza
          por atos praticados pelo profissional com base nas informações consultadas, nem garante
          resultados clínicos específicos, uma vez que a prática da enfermagem exige análise
          individualizada de cada caso. A limitação de responsabilidade aqui prevista não exclui a
          responsabilidade por dolo ou culpa grave, em estrita observância ao art. 944 do Código Civil
          e ao art. 14 do Código de Defesa do Consumidor (Lei nº 8.078/90), quando aplicável. O
          usuário assume o dever de sempre confrontar as orientações do aplicativo com as fontes
          oficiais e os protocolos vigentes em sua unidade de atuação.
        </P>

        <H3>1.5 Das Obrigações do Usuário</H3>
        <P>
          O usuário compromete-se a utilizar a ferramenta de forma ética e responsável, em total
          conformidade com o Código de Ética dos Profissionais de Enfermagem (Resolução COFEN nº
          564/2017). É proibida a inserção de dados pessoais de pacientes que permitam sua
          identificação direta ou indireta no aplicativo, salvo em funcionalidades que venham a ser
          expressamente destinadas a esse fim, sob estrita observância da Lei Geral de Proteção de
          Dados (LGPD). É vedada a reprodução, distribuição ou comercialização de qualquer conteúdo do
          aplicativo sem autorização prévia, expressa e por escrito da desenvolvedora.
        </P>

        <H3>1.6 Da Propriedade Intelectual</H3>
        <P>
          Todo o conteúdo, layout, marca, textos, logotipos e materiais didáticos do aplicativo são de
          titularidade exclusiva da desenvolvedora e estão registrados. As referências bibliográficas
          e normativas citadas pertencem aos seus respectivos autores e órgãos, sendo utilizadas
          mediante citação adequada e para fins informativos, em conformidade com a Lei nº 9.610/98.
        </P>

        <H3>1.7 Das Atualizações</H3>
        <P>
          O conteúdo clínico é revisado e datado periodicamente para assegurar a atualidade das
          informações. Alterações nestes Termos de Uso serão comunicadas aos usuários mediante aviso
          prévio na plataforma, sendo que o uso continuado após tal comunicação importará em aceitação
          tácita das novas condições.
        </P>

        <H3>1.8 Dos Planos, da Assinatura e do Pagamento</H3>
        <P>
          O acesso ao conteúdo é organizado em planos por trilha (Acadêmico, Técnico,
          Técnico-Estudante e Enfermeiro). Os preços vigentes são os exibidos na página de venda do
          respectivo plano no momento da contratação. O processamento do pagamento é realizado por
          plataforma parceira especializada (Cakto), que opera como intermediadora financeira; a
          Academia da Enfermagem não armazena dados de cartão de crédito. A liberação do acesso
          ocorre após a confirmação do pagamento e o cadastro do usuário com o mesmo e-mail
          utilizado na compra. Havendo cobrança recorrente, a renovação segue a periodicidade
          informada no checkout e permanece ativa até o cancelamento pelo usuário. Em caso de
          inadimplência ou de falha na renovação, o acesso é suspenso automaticamente até a
          regularização, sem prejuízo do direito de nova contratação.
        </P>

        <H3>1.9 Do Período de Teste Gratuito</H3>
        <P>
          A plataforma poderá oferecer período de teste gratuito de <strong>15 (quinze) dias
          corridos</strong>, contados do cadastro, com as seguintes condições: (a) o teste é
          limitado a <strong>1 (uma) trilha por usuário</strong>, sendo vedado o acesso simultâneo a
          mais de um aplicativo durante a gratuidade; (b) o teste é pessoal, intransferível e
          concedido <strong>uma única vez por pessoa, dispositivo, e-mail e telefone</strong>; (c)
          ao término do 15º dia o acesso é <strong>bloqueado automaticamente</strong>, permanecendo
          a conta ativa apenas para contratação de um plano; (d) o usuário recebe avisos na própria
          plataforma quando faltarem 5 (cinco) dias e no último dia do período; (e) o usuário que
          adquirir o acesso pago diretamente não faz jus ao período de teste, pois já dispõe do
          acesso integral contratado; (f) quem contratar as quatro trilhas terá acesso simultâneo às
          quatro. Tentativas de burlar o limite de gratuidade mediante múltiplos cadastros poderão
          resultar em bloqueio, conforme a cláusula 1.11.
        </P>

        <H3>1.10 Do Arrependimento, do Cancelamento e do Reembolso</H3>
        <P>
          Nos termos do <strong>art. 49 do Código de Defesa do Consumidor</strong>, o usuário pode
          desistir da contratação no prazo de <strong>7 (sete) dias corridos</strong> contados da
          data da compra, com <strong>devolução integral</strong> do valor pago, bastando solicitar
          por e-mail para{" "}
          <a className="font-semibold text-primary underline" href="mailto:academiadaenfermagem26@gmail.com">
            academiadaenfermagem26@gmail.com
          </a>
          . O estorno é processado pela plataforma de pagamento, observados os prazos da
          administradora do cartão ou da instituição financeira. Após o prazo de 7 dias, não há
          reembolso do período já contratado, podendo o usuário cancelar a renovação a qualquer
          tempo e manter o acesso até o fim do período vigente já pago. O cancelamento pode ser
          solicitado pelo mesmo e-mail de contato.
        </P>

        <H3>1.11 Da Conta Individual e do Uso Indevido</H3>
        <P>
          A conta é <strong>pessoal e intransferível</strong>. É vedado compartilhar login e senha,
          ceder acesso a terceiros, bem como copiar, imprimir, fotografar, gravar tela, extrair,
          reproduzir ou redistribuir, total ou parcialmente, o conteúdo da plataforma. A plataforma
          adota medidas técnicas de proteção do conteúdo; a tentativa de contorná-las constitui
          infração contratual. Constatado o uso indevido, a desenvolvedora poderá suspender ou
          encerrar o acesso, sem reembolso do período em curso, sem prejuízo das medidas cíveis e
          criminais cabíveis (Lei nº 9.610/98).
        </P>

        <H3>1.12 Da Idade Mínima e das Comunicações</H3>
        <P>
          O uso é destinado a maiores de 18 anos; menores de 18 anos somente poderão utilizar a
          plataforma assistidos ou representados por seus responsáveis legais. Ao se cadastrar, o
          usuário concorda em receber comunicações operacionais (acesso, cobrança, avisos de prazo)
          e, quando autorizado, comunicações informativas por e-mail e WhatsApp, incluindo o grupo
          VIP, podendo solicitar o descadastramento dessas comunicações a qualquer momento pelo
          e-mail de contato, sem prejuízo das mensagens estritamente operacionais.
        </P>

        <H3>1.13 Da Disponibilidade, do Suporte e das Atualizações Técnicas</H3>
        <P>
          A plataforma é fornecida em regime de melhores esforços, podendo haver indisponibilidades
          temporárias decorrentes de manutenção programada, atualização de conteúdo, falhas de
          terceiros (hospedagem, conectividade) ou eventos de força maior, sem que isso configure
          descumprimento contratual. O suporte é prestado por e-mail em dias úteis. Funcionalidades
          e módulos podem ser aprimorados, substituídos ou reorganizados ao longo do tempo,
          preservando-se o escopo essencial do plano contratado.
        </P>

        <H3>1.14 Do Foro e Legislação Aplicável</H3>
        <P>
          Estes Termos regem-se integralmente pela legislação da República Federativa do Brasil.
          Sendo o usuário consumidor, fica assegurado o direito de ajuizar eventual demanda no foro
          de seu próprio domicílio, nos termos do art. 101, I, do Código de Defesa do Consumidor.
          Nas demais hipóteses, fica eleito o foro da comarca do Rio de Janeiro/RJ, domicílio da
          desenvolvedora, sem prejuízo da aplicação de normas de ordem pública que estabeleçam foros
          diversos.
        </P>
      </Card>

      {/* PARTE II */}
      <Card className="mb-4">
        <H2 icon={ShieldCheck} id="aviso">Parte II — Aviso Legal (Disclaimer)</H2>
        <P>
          Este aplicativo é uma ferramenta técnico-científica de <strong>APOIO À DECISÃO CLÍNICA</strong>,
          destinada a estudantes e profissionais de enfermagem. Ele <strong>NÃO</strong> substitui o
          julgamento técnico do profissional, o exame clínico do paciente, nem as fontes oficiais
          (COFEN, COREN, Ministério da Saúde, ANVISA) e os protocolos institucionais. A
          responsabilidade pela conduta clínica é exclusivamente do profissional de enfermagem
          assistente. Em caso de dúvida, consulte sempre as fontes oficiais e o serviço de referência
          da sua instituição.
        </P>
      </Card>

      {/* PARTE III */}
      <Card className="mb-4">
        <H2 icon={Lock} id="privacidade">Parte III — Política de Privacidade e Proteção de Dados Pessoais (LGPD)</H2>

        <H3>3.1 Da Controladora e do Encarregado</H3>
        <P>
          A Controladora dos dados pessoais é <strong>Claudia Vargas</strong>, pessoa física, residente
          na cidade do Rio de Janeiro/RJ, e-mail de contato{" "}
          <a className="font-semibold text-primary underline" href="mailto:academiadaenfermagem26@gmail.com">
            academiadaenfermagem26@gmail.com
          </a>
          . Por medida de segurança e em atenção aos princípios da LGPD, o número completo do CPF da
          controladora não é divulgado neste documento público, sendo mantido apenas nos canais
          privados de cadastro e registro. O Encarregado de Dados (DPO) designado é a própria Claudia
          Vargas, que poderá ser contatada através do mesmo e-mail.
        </P>

        <H3>3.2 Dos Dados Coletados e Finalidades</H3>
        <P>
          (a) <strong>Dados de cadastro:</strong> nome completo, e-mail, telefone, categoria
          profissional e, quando aplicável, número de registro no COREN, com a finalidade de
          identificação do usuário, criação de conta individualizada, controle de acesso e segurança
          da plataforma e confecção de certificado. (b) <strong>Dados de uso:</strong> logs de
          acesso, versão do aplicativo utilizada, data e hora das interações, com a finalidade de
          garantir a segurança do sistema, diagnóstico de falhas técnicas e melhoria contínua dos
          serviços. (c) <strong>Dados técnicos de prevenção à fraude:</strong> identificador técnico
          do dispositivo (fingerprint), endereço IP, navegador e sistema operacional, tratados
          exclusivamente para verificar a elegibilidade ao período de teste gratuito, impedir
          cadastros duplicados e proteger a plataforma contra abusos, com base no legítimo interesse
          (art. 7º, IX, da LGPD) e na prevenção à fraude (art. 11, II, "g"). (d){" "}
          <strong>Dados de transação:</strong> e-mail, identificador do pedido, plano contratado,
          status e data de vencimento, recebidos da plataforma de pagamento para liberação e
          manutenção do acesso — <strong>não recebemos nem armazenamos dados de cartão de
          crédito</strong>. (e) <strong>Registros de aceite legal:</strong> data, hora, versão dos
          documentos aceitos, identificador do usuário e do dispositivo, como prova do consentimento.
          (f) <strong>Dados de saúde:</strong> o aplicativo NÃO coleta dados de saúde de pacientes.
          Anotações clínicas eventualmente digitadas pelo usuário em módulos assistenciais são
          armazenadas <strong>localmente no próprio dispositivo</strong> e não são enviadas aos nossos
          servidores; o usuário não deve inserir dados que identifiquem pacientes. Caso
          funcionalidades futuras venham a envolver a coleta de dados de saúde, será exigido
          consentimento específico, livre, informado e destacado do titular, nos termos do art. 11 da
          LGPD.
        </P>

        <H3>3.3 Das Bases Legais</H3>
        <P>
          O tratamento de dados fundamenta-se nas seguintes bases legais da Lei nº 13.709/2018:
          Consentimento (art. 7º, I, e art. 11, I); Execução de contrato ou procedimentos preliminares
          (art. 7º, V); Cumprimento de obrigação legal ou regulatória (art. 7º, II); e Legítimo
          interesse da controladora para fins de segurança, prevenção à fraude e aprimoramento
          tecnológico (art. 7º, IX).
        </P>

        <H3>3.4 Do Compartilhamento e dos Operadores</H3>
        <P>
          Os dados pessoais não são vendidos nem cedidos para fins publicitários de terceiros. O
          compartilhamento ocorre apenas nas seguintes hipóteses: (a) por estrito cumprimento de
          obrigação legal ou ordem judicial; (b) com a <strong>plataforma de pagamento Cakto</strong>,
          responsável pelo processamento das compras, cobranças e estornos; (c) com{" "}
          <strong>provedores de infraestrutura tecnológica, banco de dados, autenticação e
          hospedagem</strong> (incluindo Lovable Cloud/Supabase e provedores de rede de distribuição
          de conteúdo), que atuam como operadores mediante contratos que asseguram níveis de proteção
          equivalentes aos desta política; (d) com provedores de envio de e-mail transacional; (e)
          mediante consentimento prévio e expresso do titular para finalidades específicas.
        </P>

        <H3>3.5 Da Transferência Internacional de Dados</H3>
        <P>
          Parte da infraestrutura tecnológica utilizada pode estar localizada fora do território
          nacional. Nessas hipóteses, a transferência internacional observa o art. 33 da LGPD,
          realizando-se para países ou fornecedores que assegurem grau de proteção adequado ou
          mediante cláusulas contratuais específicas de proteção de dados firmadas com os operadores.
        </P>

        <H3>3.6 Do Armazenamento, da Retenção e da Segurança</H3>
        <P>
          São adotadas medidas técnicas e administrativas de segurança aptas a proteger os dados
          pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição,
          perda, alteração ou difusão, incluindo criptografia em trânsito, controle de acesso por
          perfil e regras de segurança em nível de registro no banco de dados. Prazos de retenção:
          (a) dados de cadastro e de acesso, enquanto a conta existir e por até{" "}
          <strong>5 (cinco) anos</strong> após o encerramento, para exercício regular de direitos
          (art. 16, II e III, da LGPD); (b) registros de transação e de aceite legal, por{" "}
          <strong>5 (cinco) anos</strong>, por dever legal e como prova de consentimento; (c) dados
          técnicos antifraude, por até <strong>24 (vinte e quatro) meses</strong>; (d) logs de acesso,
          por <strong>6 (seis) meses</strong>, conforme o Marco Civil da Internet. Findos os prazos,
          os dados são eliminados ou anonimizados.
        </P>

        <H3>3.7 Dos Direitos do Titular e da Exclusão da Conta</H3>
        <P>
          Em conformidade com o art. 18 da LGPD, o usuário possui o direito de obter, a qualquer
          momento e mediante requisição: confirmação da existência de tratamento; acesso aos dados;
          correção de dados incompletos ou inexatos; anonimização, bloqueio ou eliminação de dados
          desnecessários; portabilidade; informação sobre compartilhamento; revogação do consentimento
          e eliminação dos dados tratados sob tal base legal. A exclusão da conta pode ser solicitada
          a qualquer momento por e-mail ao Encarregado de Dados
          (academiadaenfermagem26@gmail.com), sendo atendida em até 15 (quinze) dias, ressalvados os
          dados cuja guarda seja obrigatória por lei. O titular pode ainda peticionar perante a
          Autoridade Nacional de Proteção de Dados (ANPD).
        </P>
      </Card>

      {/* PARTE IV */}
      <Card className="mb-4">
        <H2 icon={FileSignature} id="aceite">Parte IV — Termo de Aceite e Consentimento</H2>

        <H3>4.1 Do Registro do Aceite</H3>
        <P>
          O sistema de backend do aplicativo registra eletronicamente, no momento de cada aceite, a
          data, a hora exata (timestamp), a versão específica dos Termos de Uso e da Política de
          Privacidade aceitos, bem como o identificador único do usuário ou dispositivo. Este log de
          aceite constitui prova digital do consentimento e da adesão às normas da plataforma.
        </P>

        <H3>4.2 Da Declaração do Usuário</H3>
        <P>
          “Declaro que li e compreendi integralmente os Termos de Uso — inclusive as condições de
          assinatura, do período de teste gratuito, de arrependimento e cancelamento —, o Aviso Legal
          e a Política de Privacidade do aplicativo Academia da Enfermagem, na versão{" "}
          {LEGAL_DOC_VERSION} datada de 02 de agosto de 2026, e que estou plenamente ciente de que o
          aplicativo é uma ferramenta de apoio à decisão clínica, não substituindo, em hipótese
          alguma, o meu julgamento técnico como profissional de enfermagem. Declaro ainda que minha
          conta é pessoal e intransferível. Consinto livremente com o tratamento dos meus dados
          pessoais para as finalidades e condições indicadas na Política de Privacidade.”
        </P>

        <H3>4.3 Do Consentimento para Dados de Saúde</H3>
        <P>
          Fica registrado que, na presente data e funcionalidade do aplicativo, não ocorre a coleta ou
          processamento de dados de saúde de terceiros (pacientes). O usuário está ciente de que, caso
          novas funcionalidades que envolvam tais dados sejam implementadas, um novo consentimento
          específico e destacado será formalmente solicitado.
        </P>

        <div className="mt-5">
          {accepted ? (
            <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4" /> Aceite registrado nesta versão ({LEGAL_DOC_VERSION}).
            </p>
          ) : (
            <button
              type="button"
              onClick={accept}
              disabled={busy}
              className="w-full rounded-xl bg-emerald-900 py-3 text-sm font-extrabold text-white shadow hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Registrando aceite…" : "Li e aceito os Termos de Uso e a Política de Privacidade"}
            </button>
          )}
        </div>
      </Card>

      <p className="pb-6 text-center text-[11px] text-muted-foreground">
        Academia da Enfermagem · Claudia Vargas · Rio de Janeiro/RJ · Versão {LEGAL_DOC_VERSION} —
        02/08/2026 · academiadaenfermagem26@gmail.com
      </p>
    </AppShell>
  );
}
