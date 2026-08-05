
import { useQuery } from "@tanstack/react-query";
import { HelpCircle, ChevronDown, Award, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/AppShell";
import { useState } from "react";

export function CertificadoFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Como funciona a emissão dos certificados?",
      a: "Os certificados de 10 horas são emitidos diretamente no app após a conclusão do estudo de um conteúdo técnico. Eles possuem um código de validação único e podem ser salvos em PDF ou impressos."
    },
    {
      q: "Os certificados são gratuitos?",
      a: "Os certificados incluídos nos pacotes (assinaturas) são 100% gratuitos. Para conteúdos avulsos fora do seu plano, existe uma taxa de emissão de R$ 10,00 referente à assinatura eletrônica e processamento digital."
    },
    {
      q: "Qual o modelo e validade do certificado?",
      a: "O certificado segue um modelo técnico elegante com selo da Academia da Enfermagem (ADEC), contendo seu nome completo, o tema estudado, carga horária de 10h e data de emissão. A validade é garantida por um QR Code e código de autenticidade rastreável. Ao escanear o QR Code, a escola ou empresa poderá confirmar a veracidade do documento em nosso portal oficial, visualizando nome, conteúdo, data e horas concluídas."
    },
    {
      q: "Como solicitar o certificado de um conteúdo técnico?",
      a: "Basta acessar a área 'Minha Conta', selecionar o conteúdo técnico estudado na seção de certificados e clicar em 'Emitir'. Se o certificado não fizer parte do seu plano, o sistema gerará a taxa de emissão automaticamente."
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
      </div>
    </Card>
  );
}
