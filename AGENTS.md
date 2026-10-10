# Architecture rules
- Define this app's MCP tools separately in `src/lib/mcp/tools` and register them with the TanStack MCP plugin; generated transport routes must not be edited.
- MCP uses verified OAuth caller tokens and a shared caller-scoped database factory, preserving existing RLS and content-access checks; never use privileged clients for MCP.
- Keep OAuth consent at the public same-origin consent route and preserve its full validated return path through login and email confirmation so authorization can finish.