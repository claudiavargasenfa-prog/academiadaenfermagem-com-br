import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listAcademies from "./tools/list-academies";
import readContent from "./tools/read-content";
import mySubscriptions from "./tools/my-subscriptions";
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";
export default defineMcp({
  name: "academia-da-enfermagem",
  title: "ACADEMIA DA ENFERMAGEM",
  version: "1.0.0",
  instructions: "Consulte Academias, conteúdos autorizados e assinaturas da conta conectada. Ferramentas somente de leitura; não modificam conteúdos, pagamentos ou contas. Conteúdos clínicos são apoio educacional, não substituem avaliação profissional.",
  auth: auth.oauth.issuer({ issuer: `https://${projectRef}.supabase.co/auth/v1`, acceptedAudiences: "authenticated", requireOAuthClientClaim: true }),
  tools: [listAcademies, readContent, mySubscriptions],
});