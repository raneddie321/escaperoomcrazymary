import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { roomsQuery, settingsQuery, roomImage, heroImage, fearGhostImage } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";
import { KeyRound, Users, Timer, Flame, Instagram } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crazy Mary — מתחם הפחד של ישראל" },
      { name: "description", content: "Crazy Mary הוא מתחם הפחד של ישראל — מבוך הפחד הגדול ביותר בישראל כבר 13 שנה עם 2 קומות, והקבר, מחבואים בחושך ו-Zombie Shot כאטרקציות חדשות ומפחידות." },
      { property: "og:title", content: "Crazy Mary — מתחם הפחד של ישראל" },
      { property: "og:description", content: "מבוך הפחד הגדול ביותר בישראל כבר 13 שנה, עם 2 קומות; הקבר הוא חדר בריחה מפחיד עם שחקן, ומחבואים בחושך ו-Zombie Shot מוסיפים אימה חדשה ומרשימה." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Crazy Mary",
          description: "מתחם הפחד של ישראל — מבוך הפחד הגדול ביותר בישראל עם 2 קומות, והקבר, מחבואים בחושך ו-Zombie Shot כאטרקציות חדשות ומפחידות.",
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
        <section className="hero-stage relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-20">
            <img
              src={heroImage(settings)}
              alt=""
              aria-hidden
              className="h-full w-full object-cover opacity-70"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_78%,transparent)_34%,color-mix(in_oklab,var(--background)_35%,transparent)_58%,var(--background)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_42%,transparent)_0%,color-mix(in_oklab,var(--background)_62%,transparent)_58%,var(--background)_100%)]" />
          </div>
          <div className="absolute inset-y-0 left-0 -z-10 hidden w-[46%] items-center justify-center md:flex">
            <img
              src={fearGhostImage}
              alt=""
              aria-hidden
              className="ghost-mark w-[min(34vw,520px)] max-w-none opacity-65"
              width={410}
              height={202}
            />
          </div>
          <div className="mx-auto grid min-h-[calc(100svh-76px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[1fr_0.74fr] md:py-24">
            <div className="max-w-3xl text-center md:text-right">
              <div className="mb-5 inline-flex items-center gap-2 border border-accent/35 bg-background/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] text-accent shadow-[0_0_34px_-18px_var(--accent)] backdrop-blur sm:px-4 sm:text-[11px]">
                <Flame className="h-3.5 w-3.5" aria-hidden /> מתחם הפחד של ישראל
              </div>

              <h1
                className="text-[2.9rem] uppercase leading-none text-glow flicker sm:text-6xl md:text-8xl"
                style={{ fontFamily: "var(--font-tech)", fontWeight: 900, color: "var(--primary)" }}
              >
                CRAZY&nbsp;MARY
              </h1>
              <div className="mt-4 font-display text-[18px] uppercase leading-tight text-neon sm:text-[28px] md:text-[40px]">
                מתחם הפחד של ישראל
              </div>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/86 sm:text-lg md:text-xl">
                נכנסים למתחם אימה קולנועי עם 2 קומות של מבוך פחד, חדרי בריחה, שחקנים, חושך ואתגרים שנבנו כדי להעלות דופק. זה לא עוד חדר בריחה, זאת חוויה שנשארת בראש גם אחרי שיוצאים.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <a href="#rooms" className="btn btn-primary btn-lg">
                  גלו את החדרים
                </a>
                <Link to="/contact" className="btn btn-ghost btn-lg">
                  הזמינו עכשיו
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center sm:max-w-xl md:text-right">
                {[
                  ["13+", "שנות אימה"],
                  ["4", "אטרקציות"],
                  ["18+", "רמות קיצון"],
                ].map(([k, v]) => (
                  <div key={v} className="border-r border-accent/25 bg-background/35 px-3 py-3 backdrop-blur first:border-r-0 md:first:border-r md:last:border-r-0">
                    <div className="font-display text-2xl text-primary text-glow">{k}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-sm md:block">
              <div className="poster-card corner-frame grain overflow-hidden border border-accent/35 bg-card/50 shadow-2xl shadow-black/50 backdrop-blur">
                <img src={fearGhostImage} alt="" aria-hidden className="h-56 w-full object-cover opacity-90" width={410} height={202} />
                <div className="p-6">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-accent">Live Horror</div>
                  <div className="mt-3 font-display text-3xl uppercase leading-tight text-foreground">תעזו להיכנס?</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    מתחם אפל, אינטנסיבי ומעוצב לפרטים, לקבוצות שרוצות חוויה חזקה באמת.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section aria-label="נתונים" className="border-y border-border/50 bg-card/45 backdrop-blur">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 text-center sm:gap-6 sm:px-6 sm:py-8 md:grid-cols-4">
            {[
              { k: "13", v: "שנים של אימה" },
              { k: "2", v: "קומות של מבוך" },
              { k: "4", v: "אטרקציות מפחידות" },
              { k: "18+", v: "חוויה קולנועית" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-3xl text-glow md:text-4xl" style={{ color: "var(--primary)" }}>{s.k}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.4em] text-muted-foreground md:text-xs">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms */}
        <section id="rooms" className="section-panel mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-10 text-center sm:mb-16">
            <div className="ornament-divider mx-auto max-w-md text-[9px] uppercase tracking-[0.4em] sm:text-[10px] sm:tracking-[0.5em]">◆ 4 חדרים · 4 עולמות ◆</div>
            <h2 className="mt-5 font-display text-2xl uppercase tracking-[0.1em] text-neon sm:mt-6 sm:text-4xl sm:tracking-[0.15em] md:text-6xl">
              בחרו את החוויה המפחידה שלכם
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:mt-4 md:text-base">
              המבוך הפחד הוא האטרקציה המקורית והגדולה בישראל, עם 2 קומות של מתח, והקבר, מחבואים בחושך ו-Zombie Shot ממשיכים את המתח עם חוויה אחת חדשה ומרגשת.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-10 md:grid-cols-2">
            {rooms.map((room, i) => (
              <Link
                key={room.id}
                to="/rooms/$slug"
                params={{ slug: room.slug }}
                aria-label={`פרטים והזמנה — ${room.name}`}
                className="group room-card grain corner-frame relative block overflow-hidden bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-transparent" />
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
        <section id="pricing" className="section-panel mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-10 text-center sm:mb-14">
            <div className="ornament-divider mx-auto max-w-md text-[9px] uppercase tracking-[0.4em] sm:text-[10px] sm:tracking-[0.5em]">◆ המחירון שלנו ◆</div>
            <h2 className="mt-5 font-display text-2xl uppercase tracking-[0.1em] text-neon sm:text-4xl md:text-5xl">מחירון</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">מחיר לאדם. הכניסה על אחריותכם בלבד.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="room-card corner-frame bg-card/65 p-6 sm:p-8">
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

            <div className="room-card corner-frame bg-card/65 p-6 sm:p-8">
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
        <section className="section-panel mx-auto max-w-4xl px-6 py-20 text-center">
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

