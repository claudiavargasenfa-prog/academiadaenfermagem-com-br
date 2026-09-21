/** Traduz mensagens de erro de autenticação/banco para português do Brasil. */
const RULES: Array<[RegExp, string]> = [
  [/invalid login credentials|invalid login/i, "E-mail ou senha incorretos."],
  [/email not confirmed|email_not_confirmed/i, "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada e o spam."],
  [/user already registered|already registered|user_already_exists/i, "Este e-mail já está cadastrado. Tente fazer login."],
  [/password should be at least|at least 6 characters|weak.?password/i, "A senha deve ter pelo menos 6 caracteres."],
  [/password.*(pwned|compromised|leaked|hibp)/i, "Essa senha é muito comum e já vazou na internet. Escolha outra senha."],
  [/new password should be different/i, "A nova senha precisa ser diferente da anterior."],
  [/unable to validate email address|invalid email|email address.*invalid/i, "E-mail inválido. Confira se digitou corretamente."],
  [/(token|link).*(expired|invalid)|invalid.*(token|link)|otp_expired/i, "Este link expirou ou já foi usado. Peça um novo."],
  [/email rate limit|over_email_send_rate_limit/i, "Muitos e-mails enviados agora. Aguarde alguns minutos e tente de novo."],
  [/for security purposes|request this after|too many requests|rate limit/i, "Muitas tentativas seguidas. Aguarde um instante e tente novamente."],
  [/user not found|no user found/i, "Não encontramos uma conta com esse e-mail."],
  [/signups? not allowed|signup_disabled/i, "Os cadastros estão temporariamente desativados."],
  [/anonymous sign-?ins are disabled/i, "Não é possível entrar sem cadastro."],
  [/unsupported provider|provider is not enabled/i, "Esse método de login não está disponível no momento."],
  [/access_denied|not permitted|permission denied by user/i, "O Google não autorizou a entrada. Escolha uma conta e tente novamente."],
  [/refresh_token_already_used|refresh token.*used/i, "Sua entrada anterior venceu. Tente entrar novamente."],
  [/auth session missing|session.*(expired|not found)|jwt expired/i, "Sua sessão expirou. Entre novamente."],
  [/database error saving new user|database error/i, "Não foi possível salvar seu cadastro agora. Tente novamente em instantes."],
  [/duplicate key value|already exists/i, "Esse registro já existe."],
  [/violates row-level security|permission denied|not authorized|unauthorized/i, "Você não tem permissão para fazer isso."],
  [/failed to fetch|network ?error|load failed/i, "Falha de conexão. Verifique sua internet e tente de novo."],
  [/popup closed|user cancelled|cancelled by user/i, "Login cancelado."],
];

export function traduzirErro(input: unknown, fallback = "Não foi possível concluir. Tente novamente."): string {
  const raw =
    typeof input === "string"
      ? input
      : input && typeof input === "object" && "message" in input
        ? String((input as { message?: unknown }).message ?? "")
        : "";
  if (!raw) return fallback;
  for (const [re, pt] of RULES) if (re.test(raw)) return pt;
  // Se a mensagem parece inglesa (sem acentos e com palavras típicas), usa o texto padrão.
  if (/^[\x20-\x7E]+$/.test(raw) && /\b(the|is|not|invalid|error|failed|must|user|password|email)\b/i.test(raw)) {
    return fallback;
  }
  return raw;
}
