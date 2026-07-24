
-- Extend rooms with detail-page fields
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS long_description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS price text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hours text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS min_age text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Extend site_settings with more contact/business fields
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS facebook text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tiktok text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hours text NOT NULL DEFAULT 'ראשון-חמישי 16:00-23:00 · שישי-שבת 10:00-24:00',
  ADD COLUMN IF NOT EXISTS map_embed_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS business_name text NOT NULL DEFAULT 'Crazy Mary',
  ADD COLUMN IF NOT EXISTS business_id text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp_message text NOT NULL DEFAULT 'שלום, אשמח לפרטים והזמנה לחדר בריחה ב-Crazy Mary';

-- Rename the 4 rooms to the real ones
UPDATE public.rooms SET
  name = 'מבוך הפחד', slug = 'maze-of-fear',
  tagline = 'מבוך אפל · חוויה מצמררת',
  description = 'מבוך חשוך ומצמרר, כל פנייה חושפת סוד חדש. תמצאו את הדרך החוצה?',
  long_description = 'מבוך הפחד הוא חוויה סוחפת שמערבת פחד, חושך, אתגר וריגוש. כל פנייה מובילה למקום חדש, כל חדר מסתיר סוד. עליכם לפענח רמזים, לפתור חידות ולמצוא את דרככם החוצה תוך זמן מוגבל. מומלץ למי שאוהב חוויות אינטנסיביות ומצמררות.',
  difficulty = 'קשה', duration = '60 דקות', players = '2-8', min_age = '14+'
WHERE order_index = 0;

UPDATE public.rooms SET
  name = 'הקבר', slug = 'the-tomb',
  tagline = 'תעלומה עתיקה · מצרים אבודה',
  description = 'נכנסתם לקבר עתיק — עכשיו הדלת ננעלה. פענחו את סודות הפרעונים לפני שהזמן ייגמר.',
  long_description = 'הקבר לוקח אתכם אל תוך מצרים העתיקה — פירמידות, היירוגליפים ורוחות של פרעונים. עליכם לפענח כתובות, לפתוח סרקופגים ולמצוא את הדרך החוצה מן הקבר שנחשב לקללה. עולם עשיר בפרטים, אווירה מדויקת וחידות אינטליגנטיות.',
  difficulty = 'בינוני', duration = '60 דקות', players = '2-6', min_age = '10+'
WHERE order_index = 1;

UPDATE public.rooms SET
  name = 'מחבואים בחושך', slug = 'hide-in-the-dark',
  tagline = 'משחק חתול ועכבר · אפל וסוחף',
  description = 'משחק מחבואים בחדר חשוך לחלוטין. תשתמשו בחושים, בשקט וברמזים כדי לשרוד.',
  long_description = 'מחבואים בחושך הוא חוויה ייחודית שבה אתם משחקים מחבואים אמיתיים בתוך חלל חשוך לחלוטין, מלא מסתורים ופחדים. תזדקקו לחושים חדים, שקט מוחלט ושיתוף פעולה קבוצתי כדי לצאת בשלום. מתאים לחבורות שאוהבות אקשן ואדרנלין.',
  difficulty = 'קשה מאוד', duration = '45 דקות', players = '4-10', min_age = '16+'
WHERE order_index = 2;

UPDATE public.rooms SET
  name = 'Zombie Shot', slug = 'zombie-shot',
  tagline = 'הישרדות · יריות · זומבים',
  description = 'התפרצות זומבים — אתם הקו האחרון. חמושו, כוונו וירו לפני שיגיעו אליכם.',
  long_description = 'Zombie Shot היא חוויית הישרדות אינטראקטיבית עם רובים אקטיביים, מטרות נעות ואפקטים קולנועיים. פועלים בצוות, כובשים אזורים, מגנים על הבסיס ומחסלים גלים של זומבים. חוויה מלאת אקשן, מושלמת לגיבושים, ימי הולדת ואירועי חברה.',
  difficulty = 'קליל-בינוני', duration = '45 דקות', players = '2-12', min_age = '12+'
WHERE order_index = 3;
