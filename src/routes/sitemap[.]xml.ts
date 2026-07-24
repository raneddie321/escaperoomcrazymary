import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { createClient } = await import("@supabase/supabase-js");
        const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        });
        const { data: rooms } = await sb.from("rooms").select("slug").order("order_index");

        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/rooms", priority: "0.9", changefreq: "weekly" as const },
          ...(rooms ?? []).map((r) => ({ path: `/rooms/${r.slug}`, priority: "0.8", changefreq: "monthly" as const })),
          { path: "/about", priority: "0.6", changefreq: "monthly" as const },
          { path: "/contact", priority: "0.7", changefreq: "monthly" as const },
          { path: "/privacy", priority: "0.3", changefreq: "yearly" as const },
          { path: "/terms", priority: "0.3", changefreq: "yearly" as const },
          { path: "/accessibility", priority: "0.3", changefreq: "yearly" as const },
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
