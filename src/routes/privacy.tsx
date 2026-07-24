import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { settingsQuery } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "מדיניות פרטיות — Crazy Mary" },
      { name: "description", content: "מדיניות הפרטיות של Crazy Mary — איזה מידע נאסף, למה ולמי הוא מועבר." },
      { property: "og:title", content: "מדיניות פרטיות — Crazy Mary" },
      { property: "og:description", content: "מדיניות הפרטיות של אתר Crazy Mary." },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(settingsQuery); },
  component: () => (
    <Suspense fallback={<div className="min-h-screen" />}><Privacy /></Suspense>
  ),
});

function Privacy() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <div className="min-h-screen">
      <SiteNav instagram={s.instagram} />
      <main id="main" className="mx-auto max-w-3xl px-6 py-20 leading-relaxed">
        <h1 className="font-display text-4xl uppercase tracking-wider text-glow">מדיניות פרטיות</h1>
        <div className="ember-divider mt-4 w-40" />
        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>מדיניות זו מסבירה איזה מידע נאסף עליכם בעת שימוש באתר {s.business_name || "Crazy Mary"} וכיצד אנו משתמשים בו.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">איזה מידע נאסף</h2>
          <p>כאשר אתם פונים אלינו דרך טופס יצירת קשר, וואטסאפ או טלפון, אנו אוספים את שמכם, מספר הטלפון, כתובת האימייל ותוכן הפניה. במידה ותסכימו במפורש, אנו עשויים לשמור את פרטיכם לצורך פניה חוזרת.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">למה המידע נאסף</h2>
          <p>המידע נאסף לצורך יצירת קשר חוזר, אישור הזמנות, מתן שירות ומענה לפניות. לא נעשה שימוש במידע לצרכים שיווקיים ללא הסכמתכם.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">למי המידע מועבר</h2>
          <p>המידע נשמר במערכות המידע שלנו ואצל ספקי אחסון וניהול לקוחות. איננו מעבירים את המידע לצדדים שלישיים אלא במקרים המותרים על פי דין.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">עוגיות (Cookies)</h2>
          <p>האתר עשוי לעשות שימוש בעוגיות טכניות הכרחיות לתפעולו. כלי מדידה חיצוניים (Google Analytics, פיקסל של Meta) יופעלו רק לאחר קבלת אישור מפורש של בעל האתר.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">אבטחת מידע</h2>
          <p>האתר פועל תחת פרוטוקול HTTPS מוצפן. אנו נוקטים באמצעים סבירים להגנה על המידע שלכם, אך לא ניתן להבטיח הגנה מוחלטת.</p>

          <h2 className="pt-4 font-display text-2xl text-foreground">הזכויות שלכם</h2>
          <p>הנכם רשאים לבקש עיון, עדכון או מחיקה של המידע האישי שלכם. פנו אלינו {s.email && <>בכתובת <a className="text-accent hover:underline" href={`mailto:${s.email}`}>{s.email}</a></>} {s.phone && <>או בטלפון {s.phone}</>}.</p>

          <p className="pt-4 text-sm">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>
        </div>
      </main>
      <FloatingActions settings={s} />
      <SiteFooter settings={s} />
    </div>
  );
}
