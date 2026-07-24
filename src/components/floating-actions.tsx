import { Phone, MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";
import { telHref, whatsappHref } from "@/lib/site-data";

export function FloatingActions({ settings }: { settings: Pick<SiteSettings, "phone" | "whatsapp" | "whatsapp_message"> }) {
  if (!settings.phone && !settings.whatsapp) return null;
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-3 print:hidden">
      {settings.whatsapp && (
        <a
          href={whatsappHref(settings)}
          target="_blank"
          rel="noreferrer"
          aria-label="שלחו הודעה בוואטסאפ"
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition-transform hover:scale-110 focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
        </a>
      )}
      {settings.phone && (
        <a
          href={telHref(settings.phone)}
          aria-label={`חייגו אלינו ${settings.phone}`}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-5px_var(--primary)] transition-transform hover:scale-110 focus-visible:ring-4 focus-visible:ring-primary/40"
        >
          <Phone className="h-6 w-6" aria-hidden />
        </a>
      )}
    </div>
  );
}
