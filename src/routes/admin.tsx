import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { roomsQuery, settingsQuery, type Room, type SiteSettings } from "@/lib/site-data";
import { adminLogin, adminLogout, checkAdminSession, listBookings, updateRoom, updateSettings } from "@/lib/admin.functions";
import { CalendarClock, Loader2, LogOut, Save, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "פאנל ניהול — Crazy Mary" },
      { name: "description", content: "פאנל ניהול פנימי." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const check = useServerFn(checkAdminSession);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => check(),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.isAdmin) return <LoginForm onLoggedIn={() => refetch()} />;
  return <Panel onLogout={() => refetch()} />;
}

function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(false);
          setLoading(true);
          const res = await login({ data: { password } });
          setLoading(false);
          if (res.ok) onLoggedIn();
          else setError(true);
        }}
        className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="mt-4 font-display text-2xl uppercase tracking-widest">פאנל ניהול</h1>
          <p className="mt-1 text-sm text-muted-foreground">הכניסו סיסמת אדמין</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-center tracking-widest outline-none focus:border-primary"
          placeholder="••••••••"
          autoFocus
          aria-label="סיסמת אדמין"
        />
        {error && <p className="mt-3 text-center text-sm text-destructive">סיסמה שגויה</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-primary py-3 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "מתחבר..." : "כניסה"}
        </button>
      </form>
    </div>
  );
}

function Panel({ onLogout }: { onLogout: () => void }) {
  const qc = useQueryClient();
  const roomsQ = useQuery(roomsQuery);
  const settingsQ = useQuery(settingsQuery);
  const logout = useServerFn(adminLogout);
  const bookingsFn = useServerFn(listBookings);
  const bookingsQ = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => bookingsFn(),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-display text-xl uppercase tracking-widest">
            <span className="text-primary">Crazy Mary</span> · Admin
          </div>
          <button
            onClick={async () => { await logout(); onLogout(); }}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" aria-hidden /> יציאה
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-10">
        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest">הזמנות נכנסות</h2>
          <div className="ember-divider mt-3 w-32" />
          <div className="mt-6 grid gap-4">
            {bookingsQ.isLoading && (
              <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">טוען הזמנות...</div>
            )}
            {!bookingsQ.isLoading && bookingsQ.data?.length === 0 && (
              <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">אין הזמנות חדשות כרגע.</div>
            )}
            {bookingsQ.data?.map((booking) => (
              <article key={booking.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                      <CalendarClock className="h-4 w-4" aria-hidden /> {booking.booking_date} · {booking.booking_time}
                    </div>
                    <h3 className="mt-2 font-display text-xl">{booking.room_name}</h3>
                  </div>
                  <span className="rounded-full border border-primary/45 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
                    {booking.status === "new" ? "חדש" : booking.status}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                  <div><span className="text-foreground">שם מלא:</span> {booking.full_name}</div>
                  <div><span className="text-foreground">טלפון:</span> {booking.phone}</div>
                  <div><span className="text-foreground">ת.ז:</span> {booking.identity_number}</div>
                </div>
                <pre className="mt-4 whitespace-pre-wrap rounded-md border border-border/70 bg-background/70 p-4 text-sm leading-relaxed text-foreground">
                  {booking.admin_message}
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest">הגדרות אתר</h2>
          <div className="ember-divider mt-3 w-32" />
          {settingsQ.data && (
            <SettingsForm
              initial={settingsQ.data}
              onSaved={() => qc.invalidateQueries({ queryKey: ["settings"] })}
            />
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest">חדרים</h2>
          <div className="ember-divider mt-3 w-32" />
          <div className="mt-6 space-y-6">
            {roomsQ.data?.map((r) => (
              <RoomForm key={r.id} room={r} onSaved={() => qc.invalidateQueries({ queryKey: ["rooms"] })} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function SettingsForm({ initial, onSaved }: { initial: SiteSettings; onSaved: () => void }) {
  const [s, setS] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const save = useServerFn(updateSettings);
  useEffect(() => setS(initial), [initial]);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS({ ...s, [k]: v });

  return (
    <form
      className="mt-6 grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true); setOk(false);
        await save({ data: s });
        setSaving(false); setOk(true);
        onSaved();
        setTimeout(() => setOk(false), 2000);
      }}
    >
      <Field label="שם עסק"><input className={inputCls} value={s.business_name} onChange={(e) => set("business_name", e.target.value)} /></Field>
      <Field label="ח.פ. / ע.מ."><input className={inputCls} value={s.business_id} onChange={(e) => set("business_id", e.target.value)} /></Field>
      <Field label="כותרת ראשית (Hero)"><input className={inputCls} value={s.hero_title} onChange={(e) => set("hero_title", e.target.value)} /></Field>
      <Field label="תת-כותרת (Hero)"><input className={inputCls} value={s.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} /></Field>
      <Field label="תמונת רקע (URL, אופציונלי)"><input className={inputCls} value={s.hero_image_url} onChange={(e) => set("hero_image_url", e.target.value)} placeholder="https://..." /></Field>
      <Field label="כותרת עמוד אודות"><input className={inputCls} value={s.about_title} onChange={(e) => set("about_title", e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="טקסט אודות"><textarea rows={6} className={inputCls} value={s.about_text} onChange={(e) => set("about_text", e.target.value)} /></Field>
      </div>
      <Field label="טלפון"><input className={inputCls} value={s.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
      <Field label="וואטסאפ (מספר בינ״ל)"><input className={inputCls} value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="972501234567" /></Field>
      <div className="md:col-span-2">
        <Field label="הודעת ברירת מחדל לוואטסאפ"><input className={inputCls} value={s.whatsapp_message} onChange={(e) => set("whatsapp_message", e.target.value)} /></Field>
      </div>
      <Field label="אימייל"><input className={inputCls} value={s.email} onChange={(e) => set("email", e.target.value)} /></Field>
      <Field label="כתובת מלאה"><input className={inputCls} value={s.address} onChange={(e) => set("address", e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="שעות פעילות"><input className={inputCls} value={s.hours} onChange={(e) => set("hours", e.target.value)} /></Field>
      </div>
      <div className="md:col-span-2">
        <Field label="כתובת iframe של מפת Google (Embed URL)"><input className={inputCls} value={s.map_embed_url} onChange={(e) => set("map_embed_url", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." /></Field>
      </div>
      <Field label="אינסטגרם"><input className={inputCls} value={s.instagram} onChange={(e) => set("instagram", e.target.value)} /></Field>
      <Field label="פייסבוק"><input className={inputCls} value={s.facebook} onChange={(e) => set("facebook", e.target.value)} /></Field>
      <Field label="טיקטוק"><input className={inputCls} value={s.tiktok} onChange={(e) => set("tiktok", e.target.value)} /></Field>
      <div className="md:col-span-2 flex items-center gap-3">
        <button
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden /> {saving ? "שומר..." : "שמירה"}
        </button>
        {ok && <span className="text-sm text-accent">נשמר ✓</span>}
      </div>
    </form>
  );
}

function RoomForm({ room, onSaved }: { room: Room; onSaved: () => void }) {
  const [r, setR] = useState(room);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const save = useServerFn(updateRoom);
  useEffect(() => setR(room), [room]);

  const set = <K extends keyof Room>(k: K, v: Room[K]) => setR({ ...r, [k]: v });

  return (
    <form
      className="grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true); setOk(false);
        await save({ data: {
          id: r.id, name: r.name, tagline: r.tagline, description: r.description,
          long_description: r.long_description,
          difficulty: r.difficulty, duration: r.duration, players: r.players,
          min_age: r.min_age, price: r.price, hours: r.hours, image_url: r.image_url,
        }});
        setSaving(false); setOk(true);
        onSaved();
        setTimeout(() => setOk(false), 2000);
      }}
    >
      <div className="md:col-span-2 flex items-center gap-2">
        <span className="rounded-full border border-accent/40 bg-accent/5 px-3 py-1 text-xs uppercase tracking-widest text-accent">
          #{room.slug}
        </span>
      </div>
      <Field label="שם החדר"><input className={inputCls} value={r.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="תגית / כותרת משנה"><input className={inputCls} value={r.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="תיאור קצר"><textarea rows={3} className={inputCls} value={r.description} onChange={(e) => set("description", e.target.value)} /></Field>
      </div>
      <div className="md:col-span-2">
        <Field label="תיאור מפורט (עמוד החדר)"><textarea rows={6} className={inputCls} value={r.long_description} onChange={(e) => set("long_description", e.target.value)} /></Field>
      </div>
      <Field label="רמת קושי"><input className={inputCls} value={r.difficulty} onChange={(e) => set("difficulty", e.target.value)} /></Field>
      <Field label="משך"><input className={inputCls} value={r.duration} onChange={(e) => set("duration", e.target.value)} /></Field>
      <Field label="מספר שחקנים"><input className={inputCls} value={r.players} onChange={(e) => set("players", e.target.value)} /></Field>
      <Field label="גיל מינימלי"><input className={inputCls} value={r.min_age} onChange={(e) => set("min_age", e.target.value)} placeholder="14+" /></Field>
      <Field label="מחיר / הפניה"><input className={inputCls} value={r.price} onChange={(e) => set("price", e.target.value)} placeholder="₪120 לאדם / בירור בטלפון" /></Field>
      <Field label="שעות פעילות (של החדר, אופציונלי)"><input className={inputCls} value={r.hours} onChange={(e) => set("hours", e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="תמונה (URL, אופציונלי — יש ברירת מחדל)">
          <input className={inputCls} value={r.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
        </Field>
      </div>
      <div className="md:col-span-2 flex items-center gap-3">
        <button
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden /> {saving ? "שומר..." : "שמירת חדר"}
        </button>
        {ok && <span className="text-sm text-accent">נשמר ✓</span>}
      </div>
    </form>
  );
}
