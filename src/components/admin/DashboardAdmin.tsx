import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { BarChart3, Users, Smartphone, TrendingUp, Trophy } from "lucide-react";

export function DashboardAdmin() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      // Contagem de alunos por trilha (slug do plano)
      const { data: subData, error: subError } = await supabase
        .from("user_subscriptions")
        .select("plan_slug, status")
        .eq("status", "active");
      
      if (subError) throw subError;

      const trackCounts: Record<string, number> = {};
      (subData || []).forEach(s => {
        trackCounts[s.plan_slug] = (trackCounts[s.plan_slug] || 0) + 1;
      });

      // Total de usuários únicos
      const { count: userCount, error: userError } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true });
      
      if (userError) throw userError;

      // Guias clínicos "mais acessados" (simulado por enquanto via mini_apps mais recentes ou ativos)
      const { data: miniApps, error: miniError } = await supabase
        .from("mini_apps")
        .select("name, slug, kind, gratuitidade:gratuito")
        .eq("is_active", true)
        .limit(5);

      if (miniError) throw miniError;

      return {
        trackCounts,
        totalUsers: userCount || 0,
        topMiniApps: miniApps || []
      };
    }
  });

  if (isLoading) return <Card><p className="text-sm animate-pulse">Carregando painel de controle...</p></Card>;

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
          <Card key={t.slug} className="p-4 border-l-4 border-l-foreground/20">
            <div className="flex items-center gap-3">
              <div className={`${t.color} bg-opacity-10 p-2 rounded-lg`}>
                <Smartphone className={`h-5 w-5 ${t.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{t.name}</p>
                <p className="text-2xl font-black">{stats?.trackCounts[t.slug] || 0}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h3 className="text-sm font-black uppercase tracking-tight">Guias Clínicos Mais Relevantes</h3>
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
                {m.gratuitidade ? (
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
          <div>
            <h4 className="text-lg font-black uppercase tracking-tight">Dica da Academia</h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
              "Para um app de sucesso, observe quais módulos os alunos mais acessam e crie novos conteúdos baseados neles!"
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
