import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { settingsQuery, whatsappHref, telHref } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";
import { Phone, Mail, MapPin, Instagram, MessageCircle, Facebook, Music2, Clock, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "יצירת קשר — קרייזי מרי" },
      { name: "description", content: "צרו קשר עם קרייזי מרי — טלפון, וואטסאפ, אימייל, כתובת ושעות פעילות." },
      { property: "og:title", content: "יצירת קשר — קרייזי מרי" },
      { property: "og:description", content: "פרטי יצירת קשר, מפה ושעות פעילות." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(settingsQuery); },
  component: () => (<Suspense fallback={<div className="min-h-screen" />}><ContactContent /></Suspense>),
});

function ContactContent() {
  const { data: s } = useSuspenseQuery(settingsQuery);

  const items = [
    s.phone && { icon: Phone, label: "טלפון", value: s.phone, href: telHref(s.phone) },
    s.whatsapp && { icon: MessageCircle, label: "וואטסאפ", value: s.whatsapp, href: whatsappHref(s) },
    s.email && { icon: Mail, label: "אימייל", value: s.email, href: `mailto:${s.email}` },
    s.address && { icon: MapPin, label: "כתובת", value: s.address, href: `https://maps.google.com/?q=${encodeURIComponent(s.address)}` },
    s.hours && { icon: Clock, label: "שעות פעילות", value: s.hours, href: "" },
    s.instagram && { icon: Instagram, label: "אינסטגרם", value: "פרופיל האינסטגרם", href: s.instagram },
    s.facebook && { icon: Facebook, label: "פייסבוק", value: "עמוד הפייסבוק", href: s.facebook },
    s.tiktok && { icon: Music2, label: "טיקטוק", value: "פרופיל הטיקטוק", href: s.tiktok },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string }[];

  return (
    <div className="min-h-screen">
      <SiteNav settings={s} />
      <main id="main">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.4em] text-accent">Contact</div>
            <h1 className="mt-3 font-display text-5xl uppercase tracking-wider text-glow md:text-6xl">יצירת קשר</h1>
            <div className="ember-divider mx-auto mt-6 w-40" />
            <p className="mt-6 text-muted-foreground">שריינו חדר, שאלו שאלה או תכננו גיבוש. אנחנו כאן.</p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {items.map((it) => {
              const external = it.href.startsWith("http");
              const Wrapper = ({ children }: { children: React.ReactNode }) =>
                it.href ? (
                  <a href={it.href} target={external ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card p-6 transition-all hover:border-primary/60 hover:shadow-[0_10px_40px_-15px_var(--primary)]">
                    {children}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-6">{children}</div>
                );
              return (
                <Wrapper key={it.label}>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/5 text-accent">
                    <it.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{it.label}</div>
                    <div className="mt-1 font-display text-lg">{it.value}</div>
                  </div>
                </Wrapper>
              );
            })}
          </div>

          {s.map_embed_url && (
            <div className="mt-12 overflow-hidden rounded-lg border border-border/60">
              <iframe
                src={s.map_embed_url}
                title={`מפה למתחם ${s.business_name || "קרייזי מרי"}`}
                className="h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}

          <ContactForm settings={s} />
        </section>
      </main>
      <FloatingActions settings={s} />
      <SiteFooter settings={s} />
    </div>
  );
}

function ContactForm({ settings }: { settings: import("@/lib/site-data").SiteSettings }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="mt-16">
      <h2 className="font-display text-3xl uppercase tracking-widest">שלחו לנו הודעה</h2>
      <div className="ember-divider mt-3 w-32" />
      <p className="mt-4 text-sm text-muted-foreground">
        לחיצה על "שליחה" תפתח את WhatsApp עם ההודעה שלכם — לא נאספים פרטים בשרתי האתר. פרטי הפניה יישמרו רק אצל צוות {settings.business_name || "קרייזי מרי"} לצורך חזרה אליכם.
      </p>

      <form
        className="mt-6 grid gap-4 rounded-lg border border-border/60 bg-card p-6 md:grid-cols-2"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (!name.trim() || !phone.trim() || !message.trim()) {
            setError("נא למלא שם, טלפון והודעה.");
            return;
          }
          if (!consent) {
            setError("יש לאשר את מדיניות הפרטיות כדי להמשיך.");
            return;
          }
          if (!settings.whatsapp) {
            setError("לא הוגדר מספר וואטסאפ באתר. חייגו ישירות.");
            return;
          }
          const text = [
            `שלום, שמי ${name}.`,
            phone && `טלפון: ${phone}`,
            email && `אימייל: ${email}`,
            "",
            message,
          ].filter(Boolean).join("\n");
          const url = `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
          window.open(url, "_blank", "noopener");
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">שם מלא <span className="text-primary">*</span></span>
          <input required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" autoComplete="name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">טלפון <span className="text-primary">*</span></span>
          <input required type="tel" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" autoComplete="tel" inputMode="tel" />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">אימייל (אופציונלי)</span>
          <input type="email" maxLength={120} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" autoComplete="email" />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">הודעה <span className="text-primary">*</span></span>
          <textarea required rows={5} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" placeholder="לאיזה חדר, לאיזה תאריך, כמה משתתפים..." />
        </label>
        <label className="flex items-start gap-3 md:col-span-2">
          <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 rounded border-input" />
          <span className="text-sm text-muted-foreground">
            אני מאשר/ת שקראתי את <Link to="/privacy" className="text-accent underline">מדיניות הפרטיות</Link> ומסכים/ה שהפרטים שמסרתי יישמרו לצורך יצירת קשר חוזר. הפרטים לא יימסרו לצדדים שלישיים.
          </span>
        </label>

        {error && <p role="alert" className="md:col-span-2 rounded border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-whatsapp btn-lg">
            <Send className="h-4 w-4" aria-hidden /> שליחה בוואטסאפ
          </button>
        </div>
      </form>
    </section>
  );
}
