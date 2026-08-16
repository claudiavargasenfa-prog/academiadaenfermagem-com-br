import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Card } from "@/components/AppShell";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { renderContent } from "@/lib/markdown";

interface Drug {
  id: string;
  title: string;
  category: string;
  content: string;
  color: string;
}

interface AccordionSearchLayoutProps {
  mainTitle: string;
  drugs: Drug[];
  categories: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  vasoativos: "border-[#B8E2F2] bg-[#F0F9FF] text-[#0369A1]", // Azul bebê
  sedativos: "border-[#FBCFE8] bg-[#FFF1F2] text-[#BE185D]", // Rosa bebê
  analgésicos: "border-[#E9D5FF] bg-[#FAF5FF] text-[#7E22CE]", // Roxo bebê
  antibióticos: "border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]", // Verde bebê
  eletrólitos: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]", // Amarelo bebê
  anticoagulantes: "border-[#C7D2FE] bg-[#EEF2FF] text-[#4338CA]", // Índigo suave
};

export function AccordionSearchLayout({ mainTitle, drugs, categories }: AccordionSearchLayoutProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredDrugs = drugs.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || d.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Busca Rápida */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Busca rápida de drogas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-foreground/10 bg-white/50 backdrop-blur outline-none focus:border-gold/50 transition-all text-sm"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
            !activeCategory ? "gold-gradient text-white border-transparent" : "bg-white/50 text-muted-foreground border-foreground/5"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              activeCategory === cat 
                ? "bg-primary text-white border-transparent" 
                : "bg-white/50 text-muted-foreground border-foreground/5 hover:border-primary/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sanfona Mestra */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="main" className="border-none">
          <AccordionTrigger className="flex items-center justify-between p-5 rounded-3xl bg-primary text-white hover:no-underline shadow-lg transition-all group">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Filter className="h-5 w-5" />
              </div>
              <span className="font-display font-extrabold text-sm uppercase tracking-tighter">
                {mainTitle}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            {filteredDrugs.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-3">
                {filteredDrugs.map((drug) => (
                  <AccordionItem 
                    key={drug.id} 
                    value={drug.id}
                    className={`border rounded-2xl overflow-hidden shadow-sm transition-all ${CATEGORY_COLORS[drug.category.toLowerCase()] || "border-foreground/10 bg-white"}`}
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{drug.icon || (drug.color === 'blue' ? '💉' : '💊')}</span>
                        <div className="min-w-0">
                          <p className="font-bold text-sm uppercase tracking-tight truncate">{drug.title}</p>
                          <p className="text-[10px] opacity-70 font-black uppercase tracking-widest">{drug.category}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="bg-white/80 rounded-xl p-4 shadow-inner">
                        {renderContent(drug.content)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10 glass rounded-3xl">
                <p className="text-sm text-muted-foreground font-bold uppercase">Nenhuma droga encontrada.</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
