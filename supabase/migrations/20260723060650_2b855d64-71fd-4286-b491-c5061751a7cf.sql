
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  players text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.rooms TO anon;
GRANT SELECT ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read rooms" ON public.rooms FOR SELECT USING (true);

CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1,
  about_title text NOT NULL DEFAULT 'אודות Crazy Mary',
  about_text text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT 'https://www.instagram.com/crazy_mary_jerusalem/',
  whatsapp text NOT NULL DEFAULT '',
  hero_title text NOT NULL DEFAULT 'Crazy Mary',
  hero_subtitle text NOT NULL DEFAULT 'מתחם הפחד של ישראל',
  hero_image_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT USING (true);

INSERT INTO public.site_settings (id, about_title, about_text, phone, email, address, whatsapp, hero_title, hero_subtitle)
VALUES (
  1,
  'אודות Crazy Mary',
  'ברוכים הבאים ל-Crazy Mary — מתחם הפחד של ישראל. אנחנו מזמינים אתכם לצאת מהשגרה ולהיכנס לעולמות אפלים, מפתיעים ומרתקים. כל חדר מספר סיפור אחר, עם עיצוב מוקפד, אתגרים חכמים, ואווירה שתגרום לכם לשכוח שאתם במציאות. מושלם לזוגות, חברים, משפחות וגיבושים.',
  '',
  '',
  'ירושלים',
  '',
  'Crazy Mary',
  'מתחם הפחד של ישראל · תעזו להיכנס'
);

INSERT INTO public.rooms (slug, name, tagline, description, difficulty, duration, players, order_index) VALUES
('room-1', 'חדר מספר 1', 'החדר הראשון', 'תיאור זמני של החדר. אפשר לערוך את כל התוכן מפאנל הניהול.', 'בינוני', '60 דקות', '2-6 שחקנים', 1),
('room-2', 'חדר מספר 2', 'החדר השני', 'תיאור זמני של החדר. אפשר לערוך את כל התוכן מפאנל הניהול.', 'קשה', '60 דקות', '2-6 שחקנים', 2),
('room-3', 'חדר מספר 3', 'החדר השלישי', 'תיאור זמני של החדר. אפשר לערוך את כל התוכן מפאנל הניהול.', 'בינוני', '60 דקות', '2-5 שחקנים', 3),
('room-4', 'חדר מספר 4', 'החדר הרביעי', 'תיאור זמני של החדר. אפשר לערוך את כל התוכן מפאנל הניהול.', 'קשה מאוד', '75 דקות', '3-6 שחקנים', 4);
