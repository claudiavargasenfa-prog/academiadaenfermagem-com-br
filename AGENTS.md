# Architecture rules
- Admin inventory and organization selectors use `adminAcademies` without activation filters; activation belongs to customer visibility, so inactive and future academies remain manageable.
- Store cards require a matching active apps row and plan; apps supplies identity and plans supplies commerce, so legacy payment rows cannot impersonate an Academy.
- Define this app's MCP tools separately in `src/lib/mcp/tools` and register them with the TanStack MCP plugin; generated transport routes must not be edited.
- MCP uses verified OAuth caller tokens and a shared caller-scoped database factory, preserving existing RLS and content-access checks; never use privileged clients for MCP.
- Keep OAuth consent at the public same-origin consent route and preserve its full validated return path through login and email confirmation so authorization can finish.
- Keep ADEC landing content registered in the shared editor field catalog and persisted through app_texts with existing admin RLS; every displayed copy or image must be editable without changing membership or payment rules.
- Annual checkout must derive prices from server-validated offers and bind payments to authenticated owners; payment processing must verify signature, official provider status, currency, amount and collector before transactional access changes, preventing forged or duplicate grants.