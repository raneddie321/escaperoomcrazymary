import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const slotSchema = z.object({
  roomSlug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const createBookingSchema = slotSchema.extend({
  time: z.string().min(1).max(10),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  identityNumber: z.string().min(5).max(20),
  email: z.string().max(160).optional().default(""),
  players: z.string().max(30).optional().default(""),
  notes: z.string().max(700).optional().default(""),
});

export const getBookedSlots = createServerFn({ method: "GET" })
  .inputValidator((d: z.infer<typeof slotSchema>) => slotSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select("booking_time")
      .eq("room_slug", data.roomSlug)
      .eq("booking_date", data.date)
      .neq("status", "cancelled");

    if (error) throw new Error(error.message);
    return { times: (rows ?? []).map((row) => row.booking_time) };
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof createBookingSchema>) => createBookingSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: room, error: roomError }, { data: settings, error: settingsError }] = await Promise.all([
      supabaseAdmin.from("rooms").select("name, slug").eq("slug", data.roomSlug).single(),
      supabaseAdmin.from("site_settings").select("whatsapp").eq("id", 1).single(),
    ]);

    if (roomError) throw new Error(roomError.message);
    if (settingsError) throw new Error(settingsError.message);
    if (!room) throw new Error("Room not found");

    const adminMessage = [
      "הזמנה חדשה מהאתר",
      `חדר / פעילות: ${room.name}`,
      `תאריך: ${data.date}`,
      `שעה: ${data.time}`,
      "",
      `שם מלא: ${data.fullName}`,
      `טלפון: ${data.phone}`,
      `תעודת זהות: ${data.identityNumber}`,
      data.email && `אימייל: ${data.email}`,
      data.players && `מספר משתתפים: ${data.players}`,
      data.notes && `הערות: ${data.notes}`,
    ]
      .filter(Boolean)
      .join("\n");

    const { error } = await supabaseAdmin.from("bookings").insert({
      room_slug: room.slug,
      room_name: room.name,
      booking_date: data.date,
      booking_time: data.time,
      full_name: data.fullName,
      phone: data.phone,
      identity_number: data.identityNumber,
      email: data.email,
      players: data.players,
      notes: data.notes,
      admin_message: adminMessage,
    });

    if (error) {
      if (error.code === "23505") {
        return { ok: false as const, reason: "slot_taken" as const };
      }
      throw new Error(error.message);
    }

    const number = (settings?.whatsapp || "").replace(/\D/g, "");
    const whatsappUrl = number ? `https://wa.me/${number}?text=${encodeURIComponent(adminMessage)}` : "";
    return { ok: true as const, whatsappUrl, message: adminMessage };
  });
