import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const sessionConfig = () => ({
  password: process.env.ADMIN_SESSION_SECRET!,
  name: "cm-admin",
  maxAge: 60 * 60 * 24 * 7,
  cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
});

type AdminSession = { isAdmin?: boolean };

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.isAdmin) throw new Error("Unauthorized");
}

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { isAdmin: !!session.data.isAdmin };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => z.object({ password: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) return { ok: false as const };
    if (!matches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ isAdmin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

const roomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  long_description: z.string(),
  difficulty: z.string(),
  duration: z.string(),
  players: z.string(),
  min_age: z.string(),
  price: z.string(),
  hours: z.string(),
  image_url: z.string(),
});

export const updateRoom = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof roomSchema>) => roomSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin
      .from("rooms")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const settingsSchema = z.object({
  about_title: z.string(),
  about_text: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  tiktok: z.string(),
  whatsapp: z.string(),
  whatsapp_message: z.string(),
  hero_title: z.string(),
  hero_subtitle: z.string(),
  hero_image_url: z.string(),
  hours: z.string(),
  map_embed_url: z.string(),
  business_name: z.string(),
  business_id: z.string(),
});

export const updateSettings = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof settingsSchema>) => settingsSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
