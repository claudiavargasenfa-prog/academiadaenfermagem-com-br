
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
        <div 
          className="group rounded-xl bg-blue-500/5 p-4 text-[11px] text-blue-700 cursor-pointer hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/20"
          onClick={() => {
            const win = window.open('', '_blank');
            if (win) {
              win.document.write(`
                <html>
                  <head>
                    <title>Modelo de Certificado - ADEC</title>
                    <style>
                      body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f4f8; }
                      .certificate { 
                        width: 800px; height: 560px; padding: 40px; border: 20px solid #b8912f; background: white; position: relative; text-align: center;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                      }
                      .watermark { 
                        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 120px; color: rgba(0,0,0,0.05); font-weight: bold; pointer-events: none; text-transform: uppercase;
                      }
                      h1 { color: #0f4c35; font-size: 48px; margin-bottom: 10px; }
                      h2 { color: #b8912f; font-size: 24px; margin-bottom: 40px; }
                      .content { font-size: 20px; line-height: 1.6; color: #333; }
                      .name { font-size: 32px; font-weight: bold; color: #000; border-bottom: 2px solid #eee; display: inline-block; margin: 20px 0; padding: 0 40px; }
                      .footer { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
                      .seal { width: 100px; height: 100px; background: #b8912f; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; text-align: center; }
                      .qr { width: 80px; height: 80px; background: #eee; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666; }
                    </style>
                  </head>
                  <body>
                    <div class="certificate">
                      <div class="watermark">MODELO</div>
                      <h2>ACADEMIA DA ENFERMAGEM</h2>
                      <h1>CERTIFICADO</h1>
                      <p class="content">Certificamos para os devidos fins que</p>
                      <div class="name">NOME DO ALUNO EXEMPLO</div>
                      <p class="content">
                        concluiu com êxito o módulo técnico de especialização em<br>
                        <strong>CONTEÚDO TÉCNICO AVANÇADO</strong><br>
                        com carga horária total de 10 horas.
                      </p>
                      <div class="footer">
                        <div class="qr">QR CODE<br>VALIDAÇÃO</div>
                        <div style="text-align:center">
                          <div style="width:200px; border-top: 1px solid #000; margin-bottom: 5px;"></div>
                          <span style="font-size:12px;">Assinatura Digital ADEC</span>
                        </div>
                        <div class="seal">SELO DE<br>QUALIDADE<br>ADEC</div>
                      </div>
                    </div>
                  </body>
                </html>
              `);
              win.document.close();
            }
          }}
        >
          <div className="flex gap-2">
            <Eye className="h-4 w-4 shrink-0" />
            <p>
              <strong>Pré-visualização:</strong> <span className="underline decoration-dotted font-bold">Clique aqui para visualizar</span> o layout do seu certificado com uma tarja de <strong>MODELO</strong> antes de realizar o download do PDF oficial.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
