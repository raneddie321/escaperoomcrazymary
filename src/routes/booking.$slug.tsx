import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { FormEvent, HTMLAttributes } from "react";
import { roomsQuery, settingsQuery, roomImage } from "@/lib/site-data";
import { createBooking, getBookedSlots } from "@/lib/booking.functions";
import { CalendarDays, Clock3, MessageCircle, UserRound, ArrowRight, Check, ShieldAlert, Loader2 } from "lucide-react";

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
  const getSlots = useServerFn(getBookedSlots);
  const submit = useServerFn(createBooking);
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState(dates[0]?.value ?? "");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [email, setEmail] = useState("");
  const [players, setPlayers] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [returnHref, setReturnHref] = useState(`/rooms/${room.slug}`);

  const selectedDate = dates.find((d) => d.value === date);
  const times = ["16:00", "17:30", "19:00", "20:30", "22:00", "23:30"];
  const bookedSlotsQ = useQuery({
    queryKey: ["booked-slots", room.slug, date],
    queryFn: () => getSlots({ data: { roomSlug: room.slug, date } }),
    enabled: Boolean(date),
    staleTime: 5_000,
  });
  const bookedTimes = new Set(bookedSlotsQ.data?.times ?? []);

  useEffect(() => {
    if (typeof document === "undefined" || !document.referrer) return;
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin === window.location.origin) {
        setReturnHref(`${referrer.pathname}${referrer.search}${referrer.hash}`);
      }
    } catch {
      setReturnHref(`/rooms/${room.slug}`);
    }
  }, [room.slug]);

  async function submitBooking(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
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
    if (bookedTimes.has(time)) {
      setStep("time");
      setError("השעה הזאת כבר נתפסה. בחרו שעה אחרת.");
      await bookedSlotsQ.refetch();
      return;
    }
    if (!name.trim() || !phone.trim() || !identityNumber.trim()) {
      setError("השאירו שם מלא, טלפון ותעודת זהות כדי לאשר הזמנה.");
      return;
    }

    const whatsappWindow = window.open("", "_blank", "noopener");
    if (whatsappWindow) {
      whatsappWindow.document.write("<!doctype html><title>WhatsApp</title><body style='font-family:sans-serif;background:#07110b;color:white;display:grid;place-items:center;height:100vh;margin:0;text-align:center'><div><h1>פותח WhatsApp...</h1><p>ההזמנה נשמרת עכשיו.</p></div></body>");
    }

    setSubmitting(true);
    let result: Awaited<ReturnType<typeof submit>>;
    try {
      result = await submit({
        data: {
          roomSlug: room.slug,
          date,
          time,
          fullName: name,
          phone,
          identityNumber,
          email,
          players,
          notes,
        },
      });
    } catch (err) {
      whatsappWindow?.close();
      setSubmitting(false);
      setError(err instanceof Error ? err.message : "לא הצלחנו לשמור את ההזמנה. נסו שוב.");
      return;
    }
    setSubmitting(false);

    if (!result.ok) {
      whatsappWindow?.close();
      setStep("time");
      setError("השעה הזאת כבר לא זמינה להזמנה. בחרו שעה אחרת.");
      await bookedSlotsQ.refetch();
      return;
    }

    setSuccess(true);
    await bookedSlotsQ.refetch();
    if (result.whatsappUrl) {
      if (whatsappWindow) {
        whatsappWindow.location.href = result.whatsappUrl;
      } else {
        window.location.href = result.whatsappUrl;
      }
    } else if (!settings.whatsapp) {
      whatsappWindow?.close();
      setError("ההזמנה נשמרה באדמין, אבל לא מוגדר מספר WhatsApp באתר.");
    }
  }

  return (
    <div className="booking-standalone min-h-screen">
      <main id="main">
        <section className="relative isolate min-h-screen overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={roomImage(room)} alt="" aria-hidden className="h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--background)_96%,transparent),color-mix(in_oklab,var(--background)_74%,transparent)_54%,color-mix(in_oklab,var(--primary)_24%,var(--background)))]" />
          </div>
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign(returnHref)} className="btn btn-ghost">
                <ArrowRight className="h-4 w-4 rotate-180" aria-hidden /> חזרה לאתר
              </button>
              <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Secure Booking Window</div>
            </div>

            <div className="grid flex-1 items-center gap-8 py-8 md:grid-cols-[0.72fr_1fr]">
              <aside className="hidden md:block">
                <div className="booking-window-poster">
                  <img src={roomImage(room)} alt="" aria-hidden className="h-full w-full object-cover" />
                </div>
              </aside>

              <div>
                <div className="mb-5 inline-flex items-center gap-2 border border-accent/35 bg-background/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] text-accent backdrop-blur">
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden /> חלון הזמנה נפרד
                </div>
                <h1 className="font-display text-4xl uppercase leading-tight text-glow sm:text-5xl">
                  הזמנת {room.name}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  לאחר אישור ההזמנה השעה נחסמת, ההזמנה נשמרת בפאנל הניהול ונפתח WhatsApp עם הודעה מלאה למספר שמוגדר באתר.
                </p>

                <section className="mt-7">
                  <BookingForm
                    step={step}
                    setStep={setStep}
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                    dates={dates}
                    times={times}
                    bookedTimes={bookedTimes}
                    bookedSlotsLoading={bookedSlotsQ.isLoading}
                    selectedDate={selectedDate}
                    name={name}
                    setName={setName}
                    phone={phone}
                    setPhone={setPhone}
                    identityNumber={identityNumber}
                    setIdentityNumber={setIdentityNumber}
                    email={email}
                    setEmail={setEmail}
                    players={players}
                    setPlayers={setPlayers}
                    notes={notes}
                    setNotes={setNotes}
                    error={error}
                    success={success}
                    submitting={submitting}
                    submitBooking={submitBooking}
                  />
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function BookingForm({
  step,
  setStep,
  date,
  setDate,
  time,
  setTime,
  dates,
  times,
  bookedTimes,
  bookedSlotsLoading,
  selectedDate,
  name,
  setName,
  phone,
  setPhone,
  identityNumber,
  setIdentityNumber,
  email,
  setEmail,
  players,
  setPlayers,
  notes,
  setNotes,
  error,
  success,
  submitting,
  submitBooking,
}: {
  step: Step;
  setStep: (step: Step) => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  dates: ReturnType<typeof buildDates>;
  times: string[];
  bookedTimes: Set<string>;
  bookedSlotsLoading: boolean;
  selectedDate?: ReturnType<typeof buildDates>[number];
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  identityNumber: string;
  setIdentityNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  players: string;
  setPlayers: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  error: string | null;
  success: boolean;
  submitting: boolean;
  submitBooking: (event: FormEvent) => void;
}) {
  return (
    <form onSubmit={submitBooking} className="booking-shell">
      <div className="grid gap-3 border-b border-border/45 p-4 sm:grid-cols-3">
        <StepButton active={step === "date"} done={Boolean(date)} icon={CalendarDays} label="תאריך" onClick={() => setStep("date")} />
        <StepButton active={step === "time"} done={Boolean(time)} icon={Clock3} label="שעה" onClick={() => date && setStep("time")} />
        <StepButton active={step === "details"} done={Boolean(name && phone && identityNumber)} icon={UserRound} label="פרטים" onClick={() => date && time && setStep("details")} />
      </div>

      <div className="p-4 sm:p-6">
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
                  <p className="mt-4 text-sm text-muted-foreground">
                    {selectedDate?.fullLabel} {bookedSlotsLoading && <span>· בודק זמינות...</span>}
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {times.map((option) => {
                      const taken = bookedTimes.has(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={taken}
                          onClick={() => {
                            if (taken) return;
                            setTime(option);
                            setStep("details");
                          }}
                          className={`booking-option min-h-20 ${time === option ? "is-selected" : ""} ${taken ? "is-disabled" : ""}`}
                        >
                          <span className="font-mono text-2xl">{option}</span>
                          {taken && <span className="mt-1 text-[10px] uppercase tracking-[0.24em] text-primary">תפוס</span>}
                        </button>
                      );
                    })}
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
                    <Field label="תעודת זהות" required value={identityNumber} onChange={setIdentityNumber} inputMode="numeric" />
                    <Field label="אימייל" type="email" value={email} onChange={setEmail} autoComplete="email" />
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
              {success && (
                <div role="status" className="booking-success mt-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-[#062617]">
                    <Check className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <div className="font-display text-xl text-foreground">ההזמנה אושרה בהצלחה</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      השעה נחסמה להזמנות נוספות, הפרטים נשמרו בפאנל הניהול ונפתחה הודעת WhatsApp לשליחה.
                    </p>
                  </div>
                </div>
              )}

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
                    <button type="submit" className="btn btn-whatsapp" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <MessageCircle className="h-4 w-4" aria-hidden />}
                      {submitting ? "מאשר..." : "אישור הזמנה"}
                    </button>
                  )}
                </div>
              </div>
      </div>
    </form>
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
