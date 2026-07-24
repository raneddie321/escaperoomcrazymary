import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { settingsQuery } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "תנאי שימוש — Crazy Mary" },
      { name: "description", content: "תנאי השימוש של אתר Crazy Mary — הזמנות, ביטולים ואחריות." },
      { property: "og:title", content: "תנאי שימוש — Crazy Mary" },
      { property: "og:description", content: "תנאי השימוש באתר Crazy Mary." },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(settingsQuery); },
  component: () => (<Suspense fallback={<div className="min-h-screen" />}><Terms /></Suspense>),
});

function Terms() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <div className="min-h-screen">
      <SiteNav instagram={s.instagram} />
      <main id="main" className="mx-auto max-w-3xl px-6 py-20 leading-relaxed">
        <h1 className="font-display text-4xl uppercase tracking-wider text-glow">תנאי שימוש</h1>
        <div className="ember-divider mt-4 w-40" />
        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>השימוש באתר {s.business_name || "Crazy Mary"} ובשירותיו כפוף לתנאים המפורטים להלן. גלישה באתר או ביצוע הזמנה מהווים הסכמה לתנאים.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">כללי</h2>
          <p>האתר נועד להצגת האטרקציות, פרטי המתחם וקבלת פניות. המידע המוצג עשוי להשתנות מעת לעת ואינו מהווה התחייבות.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">הזמנות ותשלומים</h2>
          <p>הזמנת חדר נעשית מול הצוות בטלפון, וואטסאפ או טופס יצירת קשר. הזמנה תיחשב סופית רק לאחר אישור בכתב מטעמנו.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">ביטולים</h2>
          <p>ניתן לבטל או לשנות הזמנה עד 48 שעות לפני מועד ההגעה. ביטול במועד מאוחר יותר עשוי לחייב בדמי ביטול.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">אחריות והשתתפות</h2>
          <p>ההשתתפות בחדרי הבריחה היא באחריות המשתתפים. יש למלא אחר הוראות ההפעלה ולציית לצוות המקום. אנו רשאים להפסיק פעילות של משתתף המתנהג בצורה שאינה הולמת.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">קניין רוחני</h2>
          <p>כל התכנים באתר — לרבות טקסטים, תמונות ועיצוב — הם בבעלות {s.business_name || "Crazy Mary"}. אין להעתיק או להפיץ תכנים ללא אישור בכתב.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">שיפוט</h2>
          <p>על תנאים אלה יחול הדין הישראלי בלבד. סמכות השיפוט הבלעדית תהיה לבתי המשפט המוסמכים בירושלים.</p>

          <p className="pt-4 text-sm">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>
        </div>
      </main>
      <FloatingActions settings={s} />
      <SiteFooter settings={s} />
    </div>
  );
}
