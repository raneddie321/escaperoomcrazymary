import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Instagram, Facebook, Music2, Phone, Clock, MapPin, Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";

export function SiteNav({ instagram }: { instagram?: string }) {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "בית" },
    { to: "/rooms", label: "החדרים" },
    { to: "/about", label: "אודות" },
    { to: "/contact", label: "יצירת קשר" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        דלגו לתוכן הראשי
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2 font-display text-xl tracking-[0.25em] text-foreground md:text-2xl" aria-label="Crazy Mary — עמוד הבית">
          <span className="text-accent">◆</span>
          <span><span className="text-primary text-glow">CRAZY</span> MARY</span>
          <span className="text-accent">◆</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="ניווט ראשי">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
              activeProps={{ className: "text-accent" }}
            >
              {l.label}
            </Link>
          ))}
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-accent"
              aria-label="פרופיל אינסטגרם"
            >
              <Instagram className="h-5 w-5" aria-hidden />
            </a>
          )}
        </nav>
        <button
          className="md:hidden text-foreground min-h-11 min-w-11 flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/40 md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4" aria-label="ניווט נייד">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-3 text-sm uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                {l.label}
              </Link>
            ))}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded px-3 py-3 text-sm uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-accent"
              >
                <Instagram className="h-5 w-5" aria-hidden /> Instagram
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-24 border-t border-border/40 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl tracking-widest">
            <span className="text-primary">CRAZY</span> MARY
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            חדרי בריחה מסתוריים בירושלים. תעזו להיכנס.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="mb-2 font-display text-xs uppercase tracking-widest text-accent">יצירת קשר</div>
          {settings.phone && (
            <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" aria-hidden /> <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-accent">{settings.phone}</a></div>
          )}
          {settings.email && (
            <div className="mt-1 flex items-center gap-2"><Mail className="h-3.5 w-3.5" aria-hidden /> <a href={`mailto:${settings.email}`} className="hover:text-accent">{settings.email}</a></div>
          )}
          {settings.address && (
            <div className="mt-1 flex items-center gap-2"><MapPin className="h-3.5 w-3.5" aria-hidden /> {settings.address}</div>
          )}
          {settings.hours && (
            <div className="mt-1 flex items-start gap-2"><Clock className="mt-0.5 h-3.5 w-3.5" aria-hidden /> <span>{settings.hours}</span></div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="mb-2 font-display text-xs uppercase tracking-widest text-accent">עקבו אחרינו</div>
          <div className="flex flex-wrap gap-3">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-accent"><Instagram className="h-5 w-5" aria-hidden /></a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-accent"><Facebook className="h-5 w-5" aria-hidden /></a>
            )}
            {settings.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:text-accent"><Music2 className="h-5 w-5" aria-hidden /></a>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="mb-2 font-display text-xs uppercase tracking-widest text-accent">מידע</div>
          <ul className="space-y-1">
            <li><Link to="/privacy" className="hover:text-accent">מדיניות פרטיות</Link></li>
            <li><Link to="/terms" className="hover:text-accent">תנאי שימוש</Link></li>
            <li><Link to="/accessibility" className="hover:text-accent">הצהרת נגישות</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings.business_name || "Crazy Mary Jerusalem"}
        {settings.business_id && <span> · ח.פ. {settings.business_id}</span>}
      </div>
    </footer>
  );
}
