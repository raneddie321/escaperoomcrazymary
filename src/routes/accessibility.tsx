import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { settingsQuery } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "הצהרת נגישות — קרייזי מרי" },
      { name: "description", content: "הצהרת הנגישות של אתר קרייזי מרי — התאמות שבוצעו ואיך לפנות." },
      { property: "og:title", content: "הצהרת נגישות — קרייזי מרי" },
      { property: "og:description", content: "הצהרת נגישות והתאמות באתר קרייזי מרי." },
    ],
    links: [{ rel: "canonical", href: "/accessibility" }],
  }),
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(settingsQuery); },
  component: () => (<Suspense fallback={<div className="min-h-screen" />}><A11y /></Suspense>),
});

function A11y() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <div className="min-h-screen">
      <SiteNav settings={s} />
      <main id="main" className="mx-auto max-w-3xl px-6 py-20 leading-relaxed">
        <h1 className="font-display text-4xl uppercase tracking-wider text-glow">הצהרת נגישות</h1>
        <div className="ember-divider mt-4 w-40" />
        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>{s.business_name || "קרייזי מרי"} מחויב/ת להנגיש את שירותיו ואת האתר לאנשים עם מוגבלויות, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013 ובהתאם לתקן הישראלי ת"י 5568 ברמת AA.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">התאמות באתר</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>ניווט מלא באמצעות מקלדת (Tab / Shift+Tab / Enter).</li>
            <li>קישור "דלגו לתוכן הראשי" מיד בכניסה לעמוד.</li>
            <li>מבנה כותרות היררכי (H1-H4) לקוראי מסך.</li>
            <li>טקסט חלופי (alt) לתמונות משמעותיות.</li>
            <li>ניגודיות צבעים תואמת AA על רקע כהה.</li>
            <li>עיצוב רספונסיבי לטלפון, טאבלט ומחשב.</li>
            <li>שדות טופס בעלי תוויות ברורות והודעות שגיאה.</li>
          </ul>

          <h2 className="pt-4 font-display text-2xl text-foreground">מגבלות ידועות</h2>
          <p>יתכן שחלק מהתכנים המולטימדיה (וידאו, תמונות מיוחדות) עדיין אינם מונגשים במלואם. אנו פועלים באופן שוטף לשיפור נוסף.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">נגישות במתחם הפיזי</h2>
          <p>לפרטים על התאמות במתחם עצמו — חניה, כניסה, שירותים — צרו קשר לפני ההגעה ונשמח לסייע.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">רכז/ת נגישות ופניות</h2>
          <p>ניתקלתם בבעיית נגישות באתר או בשירות? נשמח לתקן. פנו אלינו:</p>
          <ul className="list-inside list-disc space-y-1">
            {s.phone && <li>טלפון: <a className="text-accent hover:underline" href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></li>}
            {s.email && <li>אימייל: <a className="text-accent hover:underline" href={`mailto:${s.email}`}>{s.email}</a></li>}
            {s.address && <li>כתובת: {s.address}</li>}
          </ul>

          <p className="pt-4 text-sm">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>
        </div>
      </main>
      <FloatingActions settings={s} />
      <SiteFooter settings={s} />
    </div>
  );
}
