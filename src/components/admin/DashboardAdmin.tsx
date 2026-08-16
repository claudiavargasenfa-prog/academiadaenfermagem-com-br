import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { BarChart3, Users, Smartphone, TrendingUp, Trophy } from "lucide-react";

export function DashboardAdmin() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      // 1. Contagem TOTAL e por CATEGORIA da tabela profiles
      // Buscamos todos os perfis para contar localmente por categoria
      // (Para volumes pequenos como 17-500 usuários, select * é eficiente e nos dá dados precisos)
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, categoria");
      
      if (pErr) throw pErr;

      const profileCounts: Record<string, number> = {
        academico: 0,
        tecnico: 0,
        enfermeiro: 0,
        "tecnico-estudante": 0
      };

      (profiles || []).forEach(p => {
        if (p.categoria && profileCounts[p.categoria] !== undefined) {
          profileCounts[p.categoria]++;
        }
      });

      // 2. Contagem de assinaturas (Active + Trial)
      const { data: subData, error: subError } = await supabase
        .from("user_subscriptions")
        .select("plan_slug")
        .in("status", ["active", "trial"])
        .gt("expires_at", new Date().toISOString());
      
      if (subError) throw subError;

      // 3. Mini Apps Relevantes (Top 5 ativos)
      const { data: miniApps, error: miniError } = await supabase
        .from("mini_apps")
        .select("name, slug, kind, gratuito")
        .eq("is_active", true)
        .limit(5);

      if (miniError) throw miniError;

      return {
        profileCounts,
        totalUsers: profiles?.length || 0,
        activeSubs: subData?.length || 0,
        topMiniApps: miniApps || []
      };
    }
  });

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gold uppercase animate-pulse">Sincronizando estatísticas...</p>
      </div>
    </div>
  );

  const tracks = [
    { slug: 'academico', name: 'Acadêmico', color: 'bg-blue-500' },
    { slug: 'tecnico', name: 'Técnico', color: 'bg-emerald-500' },
    { slug: 'enfermeiro', name: 'Enfermeiro', color: 'bg-amber-500' },
    { slug: 'tecnico-estudante', name: 'Estudante Técnico', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-black p-5 rounded-3xl border border-gold/30 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 animate-pulse" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-gold/20 p-3 rounded-2xl border border-gold/40">
            <BarChart3 className="h-8 w-8 text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Painel de Gerenciamento</h2>
            <p className="text-[10px] text-gold/70 font-bold uppercase tracking-widest">Estatísticas em Tempo Real · ADEC</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-gold">
          <div className="flex items-center gap-3">
            <div className="bg-gold/10 p-2 rounded-lg"><Users className="h-5 w-5 text-gold-dark" /></div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Total de Alunos</p>
              <p className="text-2xl font-black">{stats?.totalUsers}</p>
            </div>
          </div>
        </Card>
        
        {tracks.map(t => (
          <Card key={t.slug} className="p-4 border-l-4 border-l-foreground/20 hover:border-l-gold/50 transition-all">
            <div className="flex items-center gap-3">
              <div className={`${t.color} bg-opacity-10 p-2 rounded-lg`}>
                <Smartphone className={`h-5 w-5 ${t.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{t.name}</p>
                <p className="text-2xl font-black">{stats?.profileCounts[t.slug] || 0}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h3 className="text-sm font-black uppercase tracking-tight">Mini Apps Mais Relevantes</h3>
          </div>
          <div className="space-y-2">
            {stats?.topMiniApps.map((m, i) => (
              <div key={m.slug} className="glass p-3 flex items-center justify-between rounded-2xl border border-foreground/5 hover:border-gold/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-muted-foreground w-4">{i + 1}º</span>
                  <div>
                    <p className="text-sm font-bold uppercase">{m.name}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold uppercase">{m.kind}</p>
                  </div>
                </div>
                {m.gratuito ? (
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Grátis</span>
                ) : (
                  <span className="text-[9px] font-black bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full uppercase italic">Premium</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-foreground/5 rounded-3xl p-6 border border-dashed border-foreground/10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <Trophy className="h-10 w-10 text-gold animate-bounce" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black uppercase tracking-tight">Próximo Passo ADEC</h4>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Sugestão Técnica:</p>
            <p className="text-sm text-gold-dark font-black leading-relaxed max-w-[400px] mx-auto bg-gold/5 p-3 rounded-2xl border border-gold/20">
              CONTINUA VAZIA A ÁREA DE CONTEUDO DE DROGAS VASOATIVAS
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
