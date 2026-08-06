import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/confianca")({
  head: () => ({
    meta: [
      { title: "Confiança, Segurança e Privacidade — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Como a Academia da Enfermagem cuida dos seus dados, do seu acesso e da sua privacidade.",
      },
      { property: "og:title", content: "Confiança, Segurança e Privacidade — Academia da Enfermagem" },
      {
        property: "og:description",
        content:
          "Como a Academia da Enfermagem cuida dos seus dados, do seu acesso e da sua privacidade.",
      },
    ],
  }),
  component: TrustPage,
});

function TrustPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Confiança"
        title="Segurança e Privacidade"
        description="Esta página é mantida pela Academia da Enfermagem para responder dúvidas comuns sobre segurança, privacidade e uso dos seus dados no app."
      />

      <Card className="mb-4 border-amber-400/40 bg-amber-50/40">
        <p className="text-xs text-amber-900">
          <strong>Importante:</strong> este conteúdo é informativo e editado pela equipe da Academia da Enfermagem.
          Não é uma certificação independente nem uma auditoria externa. As práticas técnicas descritas dependem
          tanto da nossa configuração quanto da plataforma onde o app é hospedado, em um modelo de responsabilidade compartilhada.
        </p>
      </Card>

      <Section title="Acesso e autenticação">
        <ul className="list-disc space-y-1 pl-5">
          <li>Cadastro com e-mail, senha e dados básicos (nome, telefone, categoria profissional).</li>
          <li>Login adicional com Google (OAuth) para quem preferir.</li>
          <li>Sessões são gerenciadas pelo provedor de autenticação; tokens ficam no navegador do usuário.</li>
          <li>Permissões administrativas são separadas em uma tabela de papéis, não no perfil do usuário, para reduzir risco de escalonamento de privilégios.</li>
        </ul>
      </Section>

      <Section title="Plataforma e hospedagem">
        <ul className="list-disc space-y-1 pl-5">
          <li>O app é construído na Lovable, hospedado em infraestrutura serverless (Edge).</li>
          <li>O banco de dados, autenticação e armazenamento são providos por um serviço gerenciado integrado (Lovable Cloud).</li>
          <li>Tráfego entre o app e o banco/API é feito por HTTPS.</li>
        </ul>
      </Section>

      <Section title="Dados que coletamos">
        <ul className="list-disc space-y-1 pl-5">
          <li>Cadastro: nome, e-mail, telefone, categoria (acadêmico, técnico ou enfermeiro).</li>
          <li>Uso do app: assinaturas ativas, guias clínicos liberados, acessos a relatórios e progresso de estudo.</li>
          <li>Conteúdos pessoais que você escolhe salvar (ex.: anotações de diário de estágio) ficam ligados à sua conta.</li>
        </ul>
      </Section>

      <Section title="Como seus dados são protegidos">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Row Level Security (RLS):</strong> políticas no banco garantem que cada usuário só lê e edita os próprios registros.
          </li>
          <li>
            Tabelas sensíveis (papéis administrativos, assinaturas, liberação de acesso) só aceitam gravação por administradores
            ou pelo sistema interno — usuário comum não consegue se promover nem se liberar conteúdo pago.
          </li>
          <li>Chaves de serviço e segredos ficam no servidor; nunca são expostas no app.</li>
        </ul>
      </Section>

      <Section title="Pagamentos e assinaturas">
        <ul className="list-disc space-y-1 pl-5">
          <li>Pagamentos acontecem fora do app, no checkout do parceiro Cakto.</li>
          <li>Não armazenamos número de cartão ou dados financeiros sensíveis.</li>
          <li>A liberação do plano dentro do app é feita após confirmação do pagamento.</li>
        </ul>
      </Section>

      <Section title="Subprocessadores e integrações">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Lovable Cloud</strong> — hospedagem do app, banco de dados, autenticação e armazenamento.</li>
          <li><strong>Google</strong> — opcional, para login com a conta Google.</li>
          <li><strong>Cakto</strong> — processamento de pagamento de assinaturas e guias clínicos.</li>
        </ul>
      </Section>

      <Section title="Retenção e exclusão">
        <ul className="list-disc space-y-1 pl-5">
          <li>Seus dados ficam na conta enquanto ela existir.</li>
          <li>Você pode pedir a exclusão da conta entrando em contato pelo canal de suporte abaixo; após a exclusão, perfis, assinaturas e conteúdo pessoal são removidos.</li>
          <li>Registros financeiros e de auditoria podem ser mantidos pelo prazo legal aplicável.</li>
        </ul>
      </Section>

      <Section title="Solicitações de privacidade">
        <p>
          Para acesso, correção, exportação ou exclusão dos seus dados, entre em contato com a equipe da Academia da Enfermagem
          pelo canal informado abaixo. Vamos responder no menor prazo possível.
        </p>
      </Section>

      <Section title="Incidentes e contato de segurança">
        <p>
          Encontrou uma falha de segurança ou comportamento suspeito? Avise a equipe da Academia da Enfermagem pelo canal de suporte
          informado pela administradora do app. Pedimos que você não divulgue publicamente a falha antes de termos a chance de corrigi-la.
        </p>
      </Section>

      <Section title="O que esta página NÃO afirma">
        <ul className="list-disc space-y-1 pl-5">
          <li>Não somos certificados em SOC 2, ISO 27001, HIPAA ou PCI.</li>
          <li>Não garantimos "zero vulnerabilidades" — nenhum software pode prometer isso.</li>
          <li>Não somos auditados de forma independente por terceiros.</li>
        </ul>
      </Section>

      <div className="mt-6">
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">← Voltar para o início</Link>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-3">
      <h2 className="mb-2 font-display text-base font-bold">{title}</h2>
      <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
    </Card>
  );
}
