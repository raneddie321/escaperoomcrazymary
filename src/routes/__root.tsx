import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-primary text-glow">404</h1>
        <h2 className="mt-4 font-display text-xl">הדף לא נמצא</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          נראה שנעלמת בין החדרים. חזרו לכניסה הראשית.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-md bg-primary px-5 py-2.5 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
            חזרה לבית
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl">משהו השתבש</h1>
        <p className="mt-2 text-sm text-muted-foreground">נסו שוב או חזרו לעמוד הבית.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >נסו שוב</button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">חזרה לבית</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Crazy Mary — מתחם הפחד של ישראל" },
      { name: "description", content: "Crazy Mary הוא מתחם הפחד של ישראל: מבוך פחד גדול עם 2 קומות, הקבר, מחבואים בחושך ו-Zombie Shot — חוויה מפחידה, קולנועית ומרגשת." },
      { name: "author", content: "Crazy Mary" },
      { property: "og:title", content: "Crazy Mary — מתחם הפחד של ישראל" },
      { property: "og:description", content: "מבוך הפחד הגדול ביותר בישראל כבר 13 שנה, עם 2 קומות. הקבר הוא חדר בריחה מפחיד עם שחקן, ומחבואים בחושך ו-Zombie Shot מוסיפים חוויה אימתית חדשה." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Crazy Mary — מתחם הפחד של ישראל" },
      { name: "twitter:description", content: "מתחם 4 חוויות אימה: מבוך הפחד, הקבר, מחבואים בחושך ו-Zombie Shot. אווירה קולנועית, אתגרים חכמים." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;700;900&family=Orbitron:wght@500;700;900&family=Assistant:wght@300;400;600;700&family=Frank+Ruhl+Libre:wght@500;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
