import { supabase } from "@/integrations/supabase/client";
import room1 from "@/assets/room1.jpg";
import room2 from "@/assets/room2.jpg";
import room3 from "@/assets/room3.jpg";
import room4 from "@/assets/room4.jpg";
import hero from "@/assets/hero.jpg";

export const roomFallbackImages: Record<string, string> = {
  "maze-of-fear": room1,
  "the-tomb": room2,
  "hide-in-the-dark": room3,
  "zombie-shot": room4,
  // legacy slugs (in case data hasn't refreshed)
  "room-1": room1,
  "room-2": room2,
  "room-3": room3,
  "room-4": room4,
};

export const heroFallback = hero;

export type Room = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  long_description: string;
  difficulty: string;
  duration: string;
  players: string;
  min_age: string;
  price: string;
  hours: string;
  image_url: string;
  gallery: string[];
  order_index: number;
};

export type SiteSettings = {
  about_title: string;
  about_text: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  whatsapp_message: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hours: string;
  map_embed_url: string;
  business_name: string;
  business_id: string;
};

export function roomImage(r: Pick<Room, "slug" | "image_url">) {
  return r.image_url && r.image_url.length > 0 ? r.image_url : roomFallbackImages[r.slug] ?? hero;
}

export function heroImage(s: Pick<SiteSettings, "hero_image_url">) {
  return s.hero_image_url && s.hero_image_url.length > 0 ? s.hero_image_url : heroFallback;
}

export async function fetchRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    gallery: Array.isArray(r.gallery) ? (r.gallery as string[]) : [],
  })) as Room[];
}

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

export const roomsQuery = {
  queryKey: ["rooms"] as const,
  queryFn: fetchRooms,
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
};

export const settingsQuery = {
  queryKey: ["settings"] as const,
  queryFn: fetchSettings,
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
};

export function whatsappHref(s: Pick<SiteSettings, "whatsapp" | "whatsapp_message">, extra?: string) {
  const number = (s.whatsapp || "").replace(/\D/g, "");
  const msg = [s.whatsapp_message, extra].filter(Boolean).join(" · ");
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
