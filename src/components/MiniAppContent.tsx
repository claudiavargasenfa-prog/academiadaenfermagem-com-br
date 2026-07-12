import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Video, Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { useAuthReady } from "@/lib/access";
import { renderContent } from "@/lib/markdown";

import { Card } from "@/components/AppShell";
import { useAuthReady } from "@/lib/access";
import { renderContent } from "@/lib/markdown";

/**
 * Renderiza o conteúdo editável do mini app (vindo do Admin):
 * - content_md (texto/markdown)
 * - video_url (YouTube / Vimeo / mp4)
 * - audio_url
 *
 * Não exibe nada se todos os campos estiverem vazios.
 * Sempre aparece ACIMA do conteúdo fixo (hardcoded) da página.
 */
export function MiniAppContent({ slug }: { slug: string }) {
  const { isReady } = useAuthReady();
  const q = useQuery({
    queryKey: ["mini_app_content", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_apps")
        .select("content_md, video_url, audio_url")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isReady,
    staleTime: 60_000,
  });

  if (!isReady || q.isLoading) {
    return (
      <Card className="mb-6 border-primary/30 bg-primary/5 text-sm text-muted-foreground">
        Carregando conteúdo do mini app…
      </Card>
    );
  }

  if (q.isError) {
    return (
      <Card className="mb-6 border-destructive/30 bg-destructive/5 text-sm text-destructive">
        Erro ao carregar conteúdo editável: {q.error.message}
      </Card>
    );
  }

  if (!q.data) return null;
  const { content_md, video_url, audio_url } = q.data;
  if (!content_md?.trim() && !video_url?.trim() && !audio_url?.trim()) return null;

  return (
    <div className="mb-6 space-y-4">
      {video_url?.trim() && <VideoEmbed url={video_url.trim()} />}

      {audio_url?.trim() && (
        <Card>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Headphones className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Áudio</span>
          </div>
          <audio controls src={audio_url.trim()} className="w-full">
            Seu navegador não suporta o player de áudio.
          </audio>
        </Card>
      )}

      {content_md?.trim() && (
        <Card>
          <div className="prose-sm max-w-none">{renderContent(content_md)}</div>
        </Card>
      )}
    </div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const embed = toEmbedUrl(url);
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-primary">
        <Video className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">Vídeo</span>
      </div>
      {embed ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={embed}
            title="Vídeo do mini app"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <video controls src={url} className="w-full rounded-xl">
          Seu navegador não suporta o player de vídeo.
        </video>
      )}
    </Card>
  );
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      // /embed/, /shorts/
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
      if (parts[0] === "shorts" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}
