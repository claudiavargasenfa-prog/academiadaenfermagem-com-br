import { supabase } from "@/integrations/supabase/client";

export type VipPost = {
  id: string;
  user_id: string;
  author_name: string;
  category: string;
  title: string;
  body: string;
  is_pinned: boolean;
  is_official: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
};

export type VipComment = {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  body: string;
  is_official: boolean;
  created_at: string;
};

export const VIP_CATEGORIES = [
  "Dúvida",
  "Caso clínico",
  "Dica de plantão",
  "Estudos",
  "Vitória do dia",
  "Aviso oficial",
] as const;

export async function myDisplayName() {
  const { data } = await supabase.auth.getUser();
  const u = data.user;
  if (!u) return { userId: null as string | null, name: "Aluno(a)" };
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const raw =
    (meta.full_name as string) ||
    (meta.name as string) ||
    (u.email ? u.email.split("@")[0] : "") ||
    "Aluno(a)";
  return { userId: u.id, name: String(raw).slice(0, 60) };
}

export async function fetchVipPosts(): Promise<VipPost[]> {
  const { data, error } = await supabase
    .from("vip_posts")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as VipPost[];
}

export async function fetchVipComments(postId: string): Promise<VipComment[]> {
  const { data, error } = await supabase
    .from("vip_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as VipComment[];
}

export async function fetchMyLikes(): Promise<string[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data, error } = await supabase
    .from("vip_post_likes")
    .select("post_id")
    .eq("user_id", u.user.id);
  if (error) throw error;
  return (data ?? []).map((r) => r.post_id as string);
}

export async function toggleLike(postId: string, liked: boolean) {
  const { userId } = await myDisplayName();
  if (!userId) throw new Error("Faça login para curtir.");
  if (liked) {
    const { error } = await supabase
      .from("vip_post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("vip_post_likes")
      .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  }
}

export async function createVipPost(input: {
  title: string;
  body: string;
  category: string;
  isOfficial?: boolean;
  isPinned?: boolean;
}) {
  const { userId, name } = await myDisplayName();
  if (!userId) throw new Error("Faça login para publicar.");
  const { error } = await supabase.from("vip_posts").insert({
    user_id: userId,
    author_name: name,
    title: input.title.trim().slice(0, 140),
    body: input.body.trim().slice(0, 4000),
    category: input.category,
    is_official: !!input.isOfficial,
    is_pinned: !!input.isPinned,
  });
  if (error) throw error;
}

export async function createVipComment(postId: string, body: string, isOfficial = false) {
  const { userId, name } = await myDisplayName();
  if (!userId) throw new Error("Faça login para comentar.");
  const { error } = await supabase.from("vip_comments").insert({
    post_id: postId,
    user_id: userId,
    author_name: name,
    body: body.trim().slice(0, 2000),
    is_official: isOfficial,
  });
  if (error) throw error;
}

export async function deleteVipPost(id: string) {
  const { error } = await supabase.from("vip_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteVipComment(id: string) {
  const { error } = await supabase.from("vip_comments").delete().eq("id", id);
  if (error) throw error;
}

export async function setPinned(id: string, pinned: boolean) {
  const { error } = await supabase.from("vip_posts").update({ is_pinned: pinned }).eq("id", id);
  if (error) throw error;
}

/* ---------------- Simulador ---------------- */

export type RankingRow = {
  user_id: string;
  display_name: string;
  total_points: number;
  attempts: number;
  accuracy: number | null;
};

export async function saveAttempt(input: {
  quizSlug: string;
  quizTitle: string;
  category?: string;
  score: number;
  total: number;
  durationSeconds: number;
}) {
  const { userId, name } = await myDisplayName();
  if (!userId) return;
  const { error } = await supabase.from("simulado_attempts").insert({
    user_id: userId,
    display_name: name,
    quiz_slug: input.quizSlug,
    quiz_title: input.quizTitle,
    category: input.category ?? null,
    score: input.score,
    total: input.total,
    duration_seconds: input.durationSeconds,
  });
  if (error) throw error;
}

export async function fetchRanking(limit = 30): Promise<RankingRow[]> {
  const { data, error } = await supabase.rpc("simulado_ranking", { _limit: limit });
  if (error) throw error;
  return (data ?? []) as RankingRow[];
}

export async function fetchMyAttempts() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data, error } = await supabase
    .from("simulado_attempts")
    .select("*")
    .eq("user_id", u.user.id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}
