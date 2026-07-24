import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { settingsQuery, heroImage } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "אודות — Crazy Mary" },
      { name: "description", content: "הסיפור מאחורי Crazy Mary — מתחם הפחד של ישראל." },
      { property: "og:title", content: "אודות — Crazy Mary" },
      { property: "og:description", content: "הסיפור מאחורי המתחם ואיך נולדו החדרים." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(settingsQuery); },
  component: () => (<Suspense fallback={<div className="min-h-screen" />}><AboutContent /></Suspense>),
});

function AboutContent() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  return (
    <div className="min-h-screen">
      <SiteNav settings={settings} />
      <main id="main">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={heroImage(settings)} alt="" aria-hidden className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
          </div>
          <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
            <div className="text-xs uppercase tracking-[0.4em] text-accent">About</div>
            <h1 className="mt-3 font-display text-5xl uppercase tracking-wider text-glow md:text-6xl">
              {settings.about_title}
            </h1>
            <div className="ember-divider mt-6 w-40" />
            <div className="mt-10 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
              {settings.about_text}
            </div>
          </div>
        </section>
      </main>
      <FloatingActions settings={settings} />
      <SiteFooter settings={settings} />
    </div>
  );
}
