import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { roomsQuery, settingsQuery, roomImage, whatsappHref, telHref } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";
import { Timer, Users, Clock, Phone, MessageCircle, Tag, ArrowRight, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/rooms/$slug")({
  loader: async ({ context, params }) => {
    const [rooms] = await Promise.all([
      context.queryClient.ensureQueryData(roomsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
    const room = rooms.find((r) => r.slug === params.slug);
    if (!room) throw notFound();
    return { room };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.room;
    const title = r ? `${r.name} — קרייזי מרי` : "חדר — קרייזי מרי";
    const desc = r?.description || "משחק פחד במתחם הפחד של ירושלים.";
    const image = r ? roomImage(r) : undefined;
    const meta: { title?: string; name?: string; property?: string; content?: string }[] = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
    ];
    if (image && image.startsWith("http")) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }
    return { meta, links: [{ rel: "canonical", href: r ? `/rooms/${r.slug}` : "/rooms" }] };
  },
  component: () => (
    <Suspense fallback={<div className="min-h-screen" />}>
      <RoomPage />
    </Suspense>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-4xl text-primary">החדר לא נמצא</h1>
        <Link to="/rooms" className="mt-6 inline-block rounded bg-primary px-5 py-2.5 text-sm text-primary-foreground">חזרה לחדרים</Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">שגיאה בטעינת החדר.</p>
    </div>
  ),
});

function RoomPage() {
  const { slug } = Route.useParams();
  const { data: rooms } = useSuspenseQuery(roomsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const room = rooms.find((r) => r.slug === slug)!;
  const wa = whatsappHref(settings, `אני מעוניין/ת לשריין את החדר "${room.name}"`);

  const stats = [
    { icon: Timer, label: "משך", value: room.duration },
    { icon: Users, label: "שחקנים", value: room.players },
    room.price && { icon: Tag, label: "מחיר", value: room.price },
    (room.hours || settings.hours) && { icon: Clock, label: "שעות", value: room.hours || settings.hours },
  ].filter(Boolean) as { icon: typeof Timer; label: string; value: string }[];

  return (
    <div className="min-h-screen">
      <SiteNav settings={settings} />
      <main id="main">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={roomImage(room)} alt="" aria-hidden className="h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 md:py-28">
            <Link to="/rooms" className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-accent hover:underline sm:text-xs">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" aria-hidden /> כל החדרים
            </Link>
            <div className="mt-4 text-[10px] uppercase tracking-[0.35em] text-accent sm:text-xs sm:tracking-[0.4em]">{room.tagline}</div>
            <h1 className="mt-3 font-display text-3xl uppercase tracking-wider text-glow sm:text-5xl md:text-7xl">{room.name}</h1>
            <div className="ember-divider mt-5 w-28 sm:mt-6 sm:w-40" />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-8">
          <div className="overflow-hidden rounded-lg border border-border/60">
            <img
              src={roomImage(room)}
              alt={`תמונה של החדר ${room.name}`}
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-10 px-6 py-10 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-2xl uppercase tracking-widest">על החדר</h2>
            <div className="ember-divider mt-3 w-32" />
            <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
              {room.long_description || room.description}
            </p>

            {room.gallery.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-xl uppercase tracking-widest">גלריה</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {room.gallery.map((src, i) => (
                    <img key={i} src={src} alt={`תמונה נוספת מ${room.name} #${i + 1}`} loading="lazy" className="aspect-square w-full rounded object-cover" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <h2 className="font-display text-lg uppercase tracking-widest">פרטים</h2>
              <div className="ember-divider mt-3 w-24" />
              <dl className="mt-4 space-y-3 text-sm">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-4 border-b border-border/40 pb-2 last:border-none last:pb-0">
                    <dt className="inline-flex items-center gap-2 text-muted-foreground"><s.icon className="h-4 w-4 text-accent" aria-hidden /> {s.label}</dt>
                    <dd className="text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-6">
              <h2 className="font-display text-lg uppercase tracking-widest">הזמנה</h2>
              <div className="ember-divider mt-3 w-24" />
              <div className="mt-4 flex flex-col gap-3">
                <Link to="/booking/$slug" params={{ slug: room.slug }} className="btn btn-primary">
                  <CalendarDays className="h-4 w-4" aria-hidden /> הזמנת תור
                </Link>
                {settings.whatsapp && (
                  <a href={wa} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                    <MessageCircle className="h-4 w-4" aria-hidden /> וואטסאפ להזמנה
                  </a>
                )}
                {settings.phone && (
                  <a href={telHref(settings.phone)} className="btn btn-primary">
                    <Phone className="h-4 w-4" aria-hidden /> חייגו {settings.phone}
                  </a>
                )}
                <Link to="/contact" className="btn btn-ghost">
                  טופס יצירת קשר
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </main>
      <FloatingActions settings={settings} />
      <SiteFooter settings={settings} />
    </div>
  );
}
