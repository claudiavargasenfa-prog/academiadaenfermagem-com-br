
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
      q: "Onde encontro os certificados e o suporte?",
      a: "Você encontra seus certificados na seção 'Minha Conta' em cada aplicativo. Para dúvidas técnicas, garantimos que o administrador possa verificar no painel se o webhook do Pix e a assinatura estão funcionando corretamente, com mensagens claras de erro e reprocessamento quando necessário."
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
    <Card className="mt-8 border-[#b8912f]/30 bg-gradient-to-br from-[#fbf8f1] to-white hidden">
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

    </Card>
  );
}
