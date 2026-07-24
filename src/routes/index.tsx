import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { roomsQuery, settingsQuery, roomImage, heroImage } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";
import { KeyRound, Users, Timer, Flame, Instagram } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crazy Mary — חדרי בריחה בירושלים" },
      { name: "description", content: "מתחם 4 חדרי בריחה בירושלים: מבוך הפחד, הקבר, מחבואים בחושך ו-Zombie Shot. אווירה קולנועית, אתגרים חכמים." },
      { property: "og:title", content: "Crazy Mary — חדרי בריחה בירושלים" },
      { property: "og:description", content: "מתחם 4 חדרי בריחה בירושלים: מבוך הפחד, הקבר, מחבואים בחושך ו-Zombie Shot. אווירה קולנועית, אתגרים חכמים." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Crazy Mary Jerusalem",
          description: "מתחם חדרי בריחה בירושלים",
          address: { "@type": "PostalAddress", addressLocality: "ירושלים", addressCountry: "IL" },
          sameAs: ["https://www.instagram.com/crazy_mary_jerusalem/"],
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(roomsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
  },
  component: Home,
});

function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { data: rooms } = useSuspenseQuery(roomsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);

  return (
    <div className="min-h-screen">
      <SiteNav settings={settings} />
      <main id="main">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src={heroImage(settings)}
              alt=""
              aria-hidden
              className="h-full w-full object-cover opacity-35"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_75%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          </div>
          <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 md:py-40">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-accent sm:mb-6 sm:px-4 sm:py-1.5 sm:text-[11px] sm:tracking-[0.4em]">
              <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden /> Jerusalem · Escape Rooms
            </div>

            <h1
              className="mt-4 text-[2.5rem] uppercase tracking-[0.1em] text-glow flicker leading-none sm:mt-6 sm:text-5xl sm:tracking-[0.15em] md:text-8xl"
              style={{ fontFamily: "var(--font-tech)", fontWeight: 900, color: "var(--primary)" }}
            >
              CRAZY&nbsp;MARY
            </h1>
            <div className="mt-4 font-display text-[11px] uppercase tracking-[0.35em] text-accent sm:mt-6 sm:text-sm sm:tracking-[0.5em] md:text-base">
              {settings.hero_title}
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base md:text-lg">
              {settings.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10">
              <a href="#rooms" className="btn btn-primary btn-lg">
                גלו את החדרים
              </a>
              <Link to="/contact" className="btn btn-ghost btn-lg">
                הזמינו עכשיו
              </Link>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section aria-label="נתונים" className="border-y border-border/40 bg-background/60 backdrop-blur">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 text-center sm:gap-6 sm:px-6 sm:py-8 md:grid-cols-4">
            {[
              { k: "4", v: "חדרי בריחה" },
              { k: "60′", v: "משחק אינטנסיבי" },
              { k: "2–8", v: "שחקנים לחדר" },
              { k: "18+", v: "אווירה קולנועית" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-3xl text-glow md:text-4xl" style={{ color: "var(--primary)" }}>{s.k}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.4em] text-muted-foreground md:text-xs">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms */}
        <section id="rooms" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-10 text-center sm:mb-16">
            <div className="ornament-divider mx-auto max-w-md text-[9px] uppercase tracking-[0.4em] sm:text-[10px] sm:tracking-[0.5em]">◆ 4 חדרים · 4 עולמות ◆</div>
            <h2 className="mt-5 font-display text-2xl uppercase tracking-[0.1em] text-neon sm:mt-6 sm:text-4xl sm:tracking-[0.15em] md:text-6xl">
              בחרו את הגורל שלכם
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 md:text-base">
              ארבע חוויות עצמאיות. אווירה קולנועית, פאזלים חכמים, ואפקטים שמפחידים באמת.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-10 md:grid-cols-2">
            {rooms.map((room, i) => (
              <Link
                key={room.id}
                to="/rooms/$slug"
                params={{ slug: room.slug }}
                aria-label={`פרטים והזמנה — ${room.name}`}
                className="group neon-frame grain corner-frame relative block overflow-hidden bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={roomImage(room)}
                    alt={`תמונה של החדר ${room.name}`}
                    loading={i < 2 ? "eager" : "lazy"}
                    width={1200}
                    height={750}
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--card)_100%)] opacity-70" />
                  <div className="absolute top-3 right-3 rounded-sm border border-accent/60 bg-background/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-accent backdrop-blur sm:top-4 sm:right-4 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.3em]">
                    №&nbsp;{String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-sm bg-primary/90 px-2 py-0.5 text-[9px] uppercase tracking-[0.25em] text-primary-foreground sm:bottom-4 sm:left-4 sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.3em]">
                    {room.difficulty}
                  </div>
                </div>
                <div className="p-5 sm:p-7 md:p-9">
                  <div className="text-[9px] uppercase tracking-[0.4em] text-accent sm:text-[10px] sm:tracking-[0.5em]">{room.tagline}</div>
                  <h3 className="mt-2 font-display text-xl uppercase tracking-[0.08em] text-glow group-hover:text-primary sm:mt-3 sm:text-3xl sm:tracking-[0.1em] md:text-4xl">
                    {room.name}
                  </h3>
                  <div className="ember-divider my-4 w-20 sm:my-5 sm:w-24" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {room.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground sm:mt-6 sm:gap-4">
                    <span className="inline-flex items-center gap-1.5"><Flame className="h-3.5 w-3.5 text-primary" aria-hidden /> {room.difficulty}</span>
                    <span className="inline-flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-accent" aria-hidden /> {room.duration}</span>
                    <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-accent" aria-hidden /> {room.players}</span>
                  </div>
                  <span className="btn btn-ghost btn-sm mt-6 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <KeyRound className="h-4 w-4" aria-hidden /> פרטי החדר והזמנה
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-10 text-center sm:mb-14">
            <div className="ornament-divider mx-auto max-w-md text-[9px] uppercase tracking-[0.4em] sm:text-[10px] sm:tracking-[0.5em]">◆ המחירון שלנו ◆</div>
            <h2 className="mt-5 font-display text-2xl uppercase tracking-[0.1em] text-neon sm:text-4xl md:text-5xl">מחירון</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">מחיר לאדם. הכניסה על אחריותכם בלבד.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="neon-frame corner-frame bg-card/60 p-6 sm:p-8">
              <h3 className="font-display text-lg uppercase tracking-[0.2em] text-glow sm:text-xl">מבוך הפחד — לפי דרגה</h3>
              <div className="ember-divider my-4 w-20" />
              <ul className="space-y-2.5 text-sm sm:text-base">
                {[
                  ["דרגה 1-8", "80 ₪"],
                  ["דרגה 9", "90 ₪"],
                  ["דרגה 10", "100 ₪"],
                  ["דרגה 10+", "110 ₪"],
                  ["דרגה 11 (18+)", "130 ₪"],
                  ["סרטון שלכם מהמבוך", "100 ₪"],
                ].map(([l, p]) => (
                  <li key={l} className="flex items-center justify-between gap-4 border-b border-border/40 py-1.5 last:border-none">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-mono text-primary">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="neon-frame corner-frame bg-card/60 p-6 sm:p-8">
              <h3 className="font-display text-lg uppercase tracking-[0.2em] text-glow sm:text-xl">שאר האטרקציות</h3>
              <div className="ember-divider my-4 w-20" />
              <ul className="space-y-2.5 text-sm sm:text-base">
                {[
                  ["הקבר — משחק בריחה חדש (18+)", "120 ₪"],
                  ["מחבואים בחושך — חדש", "120 ₪"],
                  ["Zombie Shot — חדש", "130 ₪"],
                ].map(([l, p]) => (
                  <li key={l} className="flex items-center justify-between gap-4 border-b border-border/40 py-1.5 last:border-none">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-mono text-primary">{p}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 font-display text-lg uppercase tracking-[0.2em] text-glow sm:text-xl">המומלצים שלנו · חבילות</h3>
              <div className="ember-divider my-4 w-20" />
              <ul className="space-y-2.5 text-sm sm:text-base">
                {[
                  ["הקבר + דרגה 10", "180 ₪", "220 ₪"],
                  ["הקבר + דרגה 11 (18+)", "210 ₪", "250 ₪"],
                  ["מחבואים בחושך + הקבר", "200 ₪", "240 ₪"],
                  ["מחבואים + הקבר + דרגה 10", "300 ₪", "340 ₪"],
                  ["מחבואים + הקבר + דרגה 11 (18+)", "320 ₪", "370 ₪"],
                ].map(([l, p, was]) => (
                  <li key={l} className="flex items-center justify-between gap-3 border-b border-border/40 py-1.5 last:border-none">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="flex items-baseline gap-2 font-mono">
                      <span className="text-xs text-muted-foreground line-through opacity-60">{was}</span>
                      <span className="text-primary">{p}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] uppercase tracking-[0.35em] text-accent sm:text-xs">! הכניסה על אחריותכם בלבד !</p>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="ornament-divider mx-auto max-w-sm text-lg">◆</div>
          <h2 className="mt-6 font-display text-3xl uppercase tracking-[0.15em] md:text-5xl text-glow">מוכנים להיכנס?</h2>
          <p className="mt-4 text-muted-foreground">שריינו את החדר שלכם עוד היום. מושלם לזוגות, חברים, משפחות וגיבושים.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn btn-primary btn-lg">
              צרו קשר
            </Link>
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="btn btn-ghost btn-lg">
                <Instagram className="h-4 w-4" aria-hidden /> Instagram
              </a>
            )}
          </div>
        </section>

      </main>

      <FloatingActions settings={settings} />
      <SiteFooter settings={settings} />
    </div>
  );
}

