import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { roomsQuery, settingsQuery, roomImage } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";
import { Flame, Timer, Users, KeyRound } from "lucide-react";

export const Route = createFileRoute("/rooms/")({
  head: () => ({
    meta: [
      { title: "החדרים — Crazy Mary" },
      { name: "description", content: "4 חוויות אימה במתחם הפחד של ישראל: מבוך הפחד, הקבר, מחבואים בחושך ו-Zombie Shot." },
      { property: "og:title", content: "החדרים — Crazy Mary" },
      { property: "og:description", content: "4 אטרקציות. כל אחת עולם שלם." },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(roomsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
  },
  component: () => (
    <Suspense fallback={<div className="min-h-screen" />}>
      <RoomsContent />
    </Suspense>
  ),
});

function RoomsContent() {
  const { data: rooms } = useSuspenseQuery(roomsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);

  return (
    <div className="min-h-screen">
      <SiteNav settings={settings} />
      <main id="main">
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-accent md:text-xs">Attractions</div>
            <h1 className="mt-3 font-display text-3xl uppercase tracking-wider text-glow sm:text-4xl md:text-6xl">החדרים שלנו</h1>
            <div className="ember-divider mx-auto mt-6 w-32 md:w-40" />
            <p className="mt-6 text-sm text-muted-foreground md:text-base">בחרו את החדר שמדבר אליכם. כל אחד עולם שלם.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-2">
            {rooms.map((room, i) => (
              <Link
                key={room.id}
                to="/rooms/$slug"
                params={{ slug: room.slug }}
                className="group relative block overflow-hidden rounded-lg border border-border/60 bg-card transition-all hover:border-primary/60 hover:shadow-[0_20px_60px_-20px_var(--primary)] focus-visible:border-primary focus-visible:outline-none"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={roomImage(room)}
                    alt={`תמונה של החדר ${room.name}`}
                    loading={i < 2 ? "eager" : "lazy"}
                    width={1200}
                    height={750}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-accent md:text-xs">{room.tagline}</div>
                  <h2 className="mt-2 font-display text-2xl uppercase tracking-wider sm:text-3xl">{room.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{room.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground sm:gap-4">
                    <span className="inline-flex items-center gap-1.5"><Flame className="h-3.5 w-3.5 text-primary" aria-hidden /> {room.difficulty}</span>
                    <span className="inline-flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-accent" aria-hidden /> {room.duration}</span>
                    <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-accent" aria-hidden /> {room.players}</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
                    <KeyRound className="h-4 w-4" aria-hidden /> פרטים והזמנה
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <FloatingActions settings={settings} />
      <SiteFooter settings={settings} />
    </div>
  );
}
