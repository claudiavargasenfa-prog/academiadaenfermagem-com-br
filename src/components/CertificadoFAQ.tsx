
import { useQuery } from "@tanstack/react-query";
import { HelpCircle, ChevronDown, Award, FileText, CheckCircle2, Eye } from "lucide-react";
import { Card } from "@/components/AppShell";
import { useState } from "react";

export function CertificadoFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Como funciona a emissão dos certificados?",
      a: "Os certificados são gerados automaticamente pelo sistema com assinatura eletrônica e registro de validação. Cada documento possui um código único e QR Code, tornando-o rastreável e autêntico sem a necessidade de plataformas externas de pagamento de taxas por emissão."
    },
    {
      q: "Como é feito o pagamento e a liberação?",
      a: "O aluno realiza o PIX e anexa o comprovante diretamente no app. Na sua Área Administrativa, você verá uma lista de 'Certificados Pendentes'. Com um único clique em 'Confirmar Recebimento', o sistema libera instantaneamente o PDF oficial com o QR Code e a assinatura eletrônica para o aluno baixar na área dele. É um processo manual de conferência rápida para garantir que você receba o valor integral."
    },
    {
      q: "Qual o modelo e validade do certificado?",
      a: "O certificado segue um modelo técnico elegante com Selo da Academia da Enfermagem (ADEC), contendo seu nome completo, o tema estudado, carga horária de 10h e data de emissão. A validade é garantida por um QR Code e código de autenticidade rastreável, permitindo a confirmação imediata da veracidade do documento."
    },
    {
      q: "Como solicitar o certificado de um conteúdo técnico?",
      a: "Basta acessar a área 'Minha Conta', selecionar o conteúdo técnico estudado na seção de certificados e clicar em 'Emitir'. O sistema gera um PDF oficial com Selo da ADEC e QR Code de autenticidade pronto para download. Você também poderá ver uma pré-visualização do documento com uma tarja 'MODELO' antes de finalizar a emissão."
    }
  ];

  return (
    <Card className="mt-8 border-[#b8912f]/30 bg-gradient-to-br from-[#fbf8f1] to-white">
      <div className="mb-4 flex items-center gap-2 text-[#8a6d24]">
        <Award className="h-5 w-5" />
        <h3 className="font-display text-lg font-black uppercase tracking-tight">FAQ de Certificados</h3>
      </div>

      <div className="space-y-3">
        {faqs.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-[#b8912f]/20 bg-white/50">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#b8912f]/5"
            >
              <span className="text-sm font-bold text-[#0f2e22]">{item.q}</span>
              <ChevronDown className={`h-4 w-4 text-[#b8912f] transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
            </button>
            {openIndex === i && (
              <div className="border-t border-[#b8912f]/10 p-4 text-xs leading-relaxed text-[#4b5f57] animate-in fade-in slide-in-from-top-2">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl bg-[#b8912f]/10 p-4 text-[11px] text-[#8a6d24]">
          <div className="flex gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <p>
              <strong>Emissão Gratuita:</strong> Certificados incluídos nos pacotes de assinatura são gratuitos. 
              Para conteúdos avulsos ou extras, há uma taxa de <strong>R$ 10,00</strong> para processamento da assinatura eletrônica.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-[#0f4c35]/5 p-4 text-[11px] text-[#0f4c35]">
          <div className="flex gap-2">
            <FileText className="h-4 w-4 shrink-0" />
            <p>
              <strong>Validação Técnica:</strong> O certificado contém o <strong>Selo da ADEC</strong>, carga horária de 10h, 
              sua identificação profissional e <strong>QR Code de Autenticidade</strong> para verificação imediata de veracidade.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-blue-500/5 p-4 text-[11px] text-blue-700">
          <div className="flex gap-2">
            <Eye className="h-4 w-4 shrink-0" />
            <p>
              <strong>Pré-visualização:</strong> Visualize o layout do seu certificado com uma tarja de <strong>MODELO</strong> antes de realizar o download do PDF oficial.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
