import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import type { FormEvent, HTMLAttributes } from "react";
import { roomsQuery, settingsQuery, roomImage, whatsappHref } from "@/lib/site-data";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { FloatingActions } from "@/components/floating-actions";
import { CalendarDays, Clock3, MessageCircle, UserRound, ArrowRight, Check, ShieldAlert } from "lucide-react";

type Step = "date" | "time" | "details";

export const Route = createFileRoute("/booking/$slug")({
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
    const room = loaderData?.room;
    return {
      meta: [
        { title: room ? `הזמנת תור — ${room.name}` : "הזמנת תור — Crazy Mary" },
        {
          name: "description",
          content: room
            ? `בחרו תאריך, שעה והשאירו פרטים להזמנת ${room.name} במתחם הפחד של ישראל.`
            : "בחרו תאריך, שעה והשאירו פרטים להזמנה במתחם הפחד של ישראל.",
        },
      ],
      links: [{ rel: "canonical", href: room ? `/booking/${room.slug}` : "/rooms" }],
    };
  },
  component: () => (
    <Suspense fallback={<div className="min-h-screen" />}>
      <BookingPage />
    </Suspense>
  ),
});

function BookingPage() {
  const { slug } = Route.useParams();
  const { data: rooms } = useSuspenseQuery(roomsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const room = rooms.find((r) => r.slug === slug)!;

  const dates = useMemo(() => buildDates(), []);
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState(dates[0]?.value ?? "");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [players, setPlayers] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedDate = dates.find((d) => d.value === date);
  const times = ["16:00", "17:30", "19:00", "20:30", "22:00", "23:30"];

  function submitBooking(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!date) {
      setStep("date");
      setError("בחרו תאריך כדי להמשיך.");
      return;
    }
    if (!time) {
      setStep("time");
      setError("בחרו שעה כדי להמשיך.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("השאירו שם וטלפון כדי שנוכל לחזור אליכם.");
      return;
    }

    const message = [
      `שלום, אני רוצה להזמין את ${room.name}.`,
      `תאריך: ${selectedDate?.fullLabel ?? date}`,
      `שעה: ${time}`,
      players && `מספר משתתפים: ${players}`,
      `שם: ${name}`,
      `טלפון: ${phone}`,
      notes && `הערות: ${notes}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappHref(settings, message), "_blank", "noopener");
  }

  return (
    <div className="min-h-screen">
      <SiteNav settings={settings} />
      <main id="main">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={roomImage(room)} alt="" aria-hidden className="h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/80 to-background" />
          </div>
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
            <Link to="/rooms/$slug" params={{ slug: room.slug }} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-accent hover:underline sm:text-xs">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" aria-hidden /> חזרה לחדר
            </Link>
            <div className="mt-5 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 border border-accent/35 bg-background/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] text-accent backdrop-blur">
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden /> טופס ייעודי לחדר
                </div>
                <h1 className="mt-4 font-display text-4xl uppercase leading-tight text-glow sm:text-5xl md:text-7xl">
                  הזמנת {room.name}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  בחרו תאריך, המשיכו לשעה, השאירו פרטים וההודעה תיפתח ישירות ב־WhatsApp עם כל פרטי ההזמנה לחדר הזה.
                </p>
              </div>
              <div className="booking-preview corner-frame grain overflow-hidden border border-accent/30 bg-card/50 backdrop-blur">
                <img src={roomImage(room)} alt="" aria-hidden className="h-56 w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <form onSubmit={submitBooking} className="booking-shell">
            <div className="grid gap-3 border-b border-border/45 p-4 sm:grid-cols-3 sm:p-6">
              <StepButton active={step === "date"} done={Boolean(date)} icon={CalendarDays} label="תאריך" onClick={() => setStep("date")} />
              <StepButton active={step === "time"} done={Boolean(time)} icon={Clock3} label="שעה" onClick={() => date && setStep("time")} />
              <StepButton active={step === "details"} done={Boolean(name && phone)} icon={UserRound} label="פרטים" onClick={() => date && time && setStep("details")} />
            </div>

            <div className="p-4 sm:p-8">
              {step === "date" && (
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-widest">בחרו תאריך</h2>
                  <div className="ember-divider mt-3 w-32" />
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {dates.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setDate(option.value);
                          setStep("time");
                        }}
                        className={`booking-option min-h-28 ${date === option.value ? "is-selected" : ""}`}
                      >
                        <span className="text-[10px] uppercase tracking-[0.3em] text-accent">{option.weekday}</span>
                        <span className="mt-2 font-display text-4xl text-foreground">{option.day}</span>
                        <span className="mt-1 text-sm text-muted-foreground">{option.month}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "time" && (
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-widest">בחרו שעה</h2>
                  <div className="ember-divider mt-3 w-32" />
                  <p className="mt-4 text-sm text-muted-foreground">{selectedDate?.fullLabel}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {times.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setTime(option);
                          setStep("details");
                        }}
                        className={`booking-option min-h-20 ${time === option ? "is-selected" : ""}`}
                      >
                        <span className="font-mono text-2xl">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "details" && (
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-widest">השאירו פרטים</h2>
                  <div className="ember-divider mt-3 w-32" />
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field label="שם מלא" required value={name} onChange={setName} autoComplete="name" />
                    <Field label="טלפון" required type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
                    <Field label="מספר משתתפים" value={players} onChange={setPlayers} inputMode="numeric" />
                    <label className="block md:col-span-2">
                      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">הערות</span>
                      <textarea
                        rows={4}
                        maxLength={600}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full rounded-md border border-input bg-background/75 px-3 py-2.5 outline-none transition focus:border-primary"
                        placeholder="יום הולדת, רמת פחד, שעה חלופית..."
                      />
                    </label>
                  </div>
                </div>
              )}

              {error && <p role="alert" className="mt-6 rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/45 pt-6">
                <div className="text-sm text-muted-foreground">
                  {selectedDate?.fullLabel || "בחרו תאריך"} {time && <span>· {time}</span>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {step !== "date" && (
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(step === "details" ? "time" : "date")}>
                      חזרה
                    </button>
                  )}
                  {step !== "details" ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setStep(step === "date" ? "time" : "details")}
                      disabled={step === "date" ? !date : !time}
                    >
                      המשך
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-whatsapp">
                      <MessageCircle className="h-4 w-4" aria-hidden /> שליחה בוואטסאפ
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
      <FloatingActions settings={settings} />
      <SiteFooter settings={settings} />
    </div>
  );
}

function StepButton({
  active,
  done,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  done: boolean;
  icon: typeof CalendarDays;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`booking-step ${active ? "is-active" : ""}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/35 bg-background/70 text-accent">
        {done ? <Check className="h-4 w-4" aria-hidden /> : <Icon className="h-4 w-4" aria-hidden />}
      </span>
      <span>{label}</span>
    </button>
  );
}

function Field({
  label,
  required,
  type = "text",
  value,
  onChange,
  autoComplete,
  inputMode,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <input
        required={required}
        type={type}
        maxLength={120}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background/75 px-3 py-2.5 outline-none transition focus:border-primary"
        autoComplete={autoComplete}
        inputMode={inputMode}
      />
    </label>
  );
}

function buildDates() {
  const formatter = new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "numeric", month: "long" });
  const monthFormatter = new Intl.DateTimeFormat("he-IL", { month: "long" });
  const weekdayFormatter = new Intl.DateTimeFormat("he-IL", { weekday: "long" });
  const dates = [];
  const now = new Date();
  for (let index = 0; index < 8; index += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + index);
    dates.push({
      value: formatDateValue(date),
      day: String(date.getDate()).padStart(2, "0"),
      month: monthFormatter.format(date),
      weekday: index === 0 ? "היום" : weekdayFormatter.format(date),
      fullLabel: formatter.format(date),
    });
  }
  return dates;
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
