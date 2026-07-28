import { supabase } from "@/integrations/supabase/client";
import room1 from "@/assets/room1.jpg";
import room2 from "@/assets/room2.jpg";
import room3 from "@/assets/room3.jpg";
import room4 from "@/assets/room4.jpg";
import hero from "@/assets/hero.jpg";
import fearGhost from "@/assets/fear-ghost.png";

export const roomFallbackImages: Record<string, string> = {
  "maze-of-fear": room1,
  "the-tomb": room2,
  "hide-in-the-dark": room3,
  "zombie-shot": room4,
  // legacy slugs (in case data hasn't refreshed)
  "room-1": room1,
  "room-2": room2,
  "room-3": room3,
  "room-4": room4,
};

export const heroFallback = hero;
export const fearGhostImage = fearGhost;

export type Room = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  long_description: string;
  difficulty: string;
  duration: string;
  players: string;
  min_age: string;
  price: string;
  hours: string;
  image_url: string;
  gallery: string[];
  order_index: number;
};

export type SiteSettings = {
  about_title: string;
  about_text: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  whatsapp_message: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hours: string;
  map_embed_url: string;
  business_name: string;
  business_id: string;
};

export function roomImage(r: Pick<Room, "slug" | "image_url">) {
  return r.image_url && r.image_url.length > 0 ? r.image_url : roomFallbackImages[r.slug] ?? hero;
}

export function heroImage(s: Pick<SiteSettings, "hero_image_url">) {
  return s.hero_image_url && s.hero_image_url.length > 0 ? s.hero_image_url : heroFallback;
}

export async function fetchRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...normalizeRoom(r as Room),
    gallery: Array.isArray(r.gallery) ? (r.gallery as string[]) : [],
  })) as Room[];
}

const roomContentOverrides: Record<string, Partial<Room>> = {
  "maze-of-fear": {
    tagline: "שתי קומות של אימה",
    description: "מסלול אימה חי בשתי קומות, עם חושך, מעברים מפתיעים ושחקנים שמופיעים כשאתם הכי לא מוכנים.",
    long_description:
      "מבוך הפחד הוא אטרקציית אימה חיה לקבוצות שרוצות להיכנס לתוך סיפור מלחיץ, פיזי וסוחף. עוברים בין חדרים, מסדרונות ופינות חשוכות, כשהקצב עולה מרגע לרגע וכל החלטה משפיעה על החוויה. מתאים לחברים, משפחות וקבוצות שמחפשות פחד אמיתי בלי להסתפק בחדר רגיל.",
    duration: "20-30 דקות",
    players: "2-10 אנשים",
    difficulty: "",
    min_age: "",
  },
  "the-tomb": {
    tagline: "משחק בריחה חדש",
    description: "חדר בריחה אפל ומותח שבו כל רמז מקרב אתכם אל האמת, וכל דקה בתוך הקבר מרגישה קצרה מדי.",
    long_description:
      "הקבר הוא משחק בריחה עם אווירה כבדה, תפאורה מושקעת ורגעים שמכניסים את הקבוצה עמוק לתוך העלילה. תצטרכו לחפש רמזים, לפתור מנעולים, לחבר פרטים קטנים ולשמור על קור רוח עד היציאה. זה משחק שמרגיש קולנועי, אבל משאיר את השליטה בידיים שלכם.",
    duration: "40 דקות בממוצע",
    players: "2-10 אנשים",
    difficulty: "",
    min_age: "",
  },
  "hide-in-the-dark": {
    tagline: "משחק חושך חי",
    description: "משחק מחבואים בחושך מוחלט שבו ההקשבה, הנשימה והצעדים הקטנים הם ההבדל בין להיתפס לבין להיעלם.",
    long_description:
      "מחבואים בחושך לוקח משחק ילדות מוכר והופך אותו לחוויה אינטנסיבית בתוך מתחם אפל. הקבוצה נכנסת לסביבה חשוכה, מתפצלת, מסתתרת ומנסה לא להיתפס בזמן שהלחץ עולה. זו פעילות מהירה, חברתית ומלאת אדרנלין שמתאימה למי שרוצה פחד אחר, לא צפוי וקבוצתי.",
    duration: "30 דקות בממוצע",
    players: "2-10 אנשים",
    difficulty: "",
    min_age: "",
  },
  "zombie-shot": {
    tagline: "משחק יריות חדש",
    description: "זירת יריות מול זומבים עם קצב גבוה, משימות קצרות והרבה אדרנלין מהרגע הראשון.",
    long_description:
      "זומבישוט הוא משחק יריות חדש שמכניס אתכם לזירת פעולה חשוכה ומהירה. נכנסים כצוות, מקבלים מטרה, מתקדמים בין אזורים ומנסים לשרוד את המתקפה עד סוף הסיבוב. זו אטרקציה ישירה, אנרגטית ומלאת אקשן למי שרוצה לשלב פחד עם משחק יריות קבוצתי.",
    duration: "30 דקות בממוצע",
    players: "2-10 אנשים",
    difficulty: "",
    min_age: "",
  },
};

function normalizeRoom(room: Room): Room {
  return {
    ...room,
    ...(roomContentOverrides[room.slug] ?? {}),
  };
}

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return normalizeSettings(data as SiteSettings);
}

function normalizeBrandText(value: string) {
  return value
    .replaceAll("מתחם הפחד של ישראל", "מתחם הפחד של ירושלים")
    .replaceAll("מתחם חדרי בריחה מסתורי בלב ירושלים", "מתחם הפחד של ירושלים")
    .replaceAll("מתחם חדרי הבריחה של ירושלים", "מתחם הפחד של ירושלים")
    .replaceAll("מתחם חדרי בריחה בירושלים", "מתחם הפחד של ירושלים")
    .replaceAll("חדרי בריחה בירושלים", "מתחם הפחד של ירושלים");
}

function normalizeSettings(settings: SiteSettings): SiteSettings {
  const businessName =
    settings.business_name === "Crazy Mary" || settings.business_name === "Crazy Mary Jerusalem"
      ? "קרייזי מרי"
      : normalizeBrandText(settings.business_name);

  return {
    ...settings,
    about_title: normalizeBrandText(settings.about_title),
    about_text: normalizeBrandText(settings.about_text),
    hero_title: normalizeBrandText(settings.hero_title),
    hero_subtitle: normalizeBrandText(settings.hero_subtitle),
    address: !settings.address || settings.address === "ירושלים" ? "רחוב הרכבים 13, ירושלים" : settings.address,
    business_name: businessName,
    whatsapp_message: normalizeBrandText(settings.whatsapp_message),
  };
}

export const roomsQuery = {
  queryKey: ["rooms"] as const,
  queryFn: fetchRooms,
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
};

export const settingsQuery = {
  queryKey: ["settings"] as const,
  queryFn: fetchSettings,
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
};

export function whatsappHref(s: Pick<SiteSettings, "whatsapp" | "whatsapp_message">, extra?: string) {
  const number = (s.whatsapp || "").replace(/\D/g, "");
  const msg = [s.whatsapp_message, extra].filter(Boolean).join(" · ");
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
