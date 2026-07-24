
UPDATE public.rooms SET
  name='מבוך הפחד',
  tagline='האטרקציה המקורית',
  description='מבוך אינטראקטיבי עם 11 דרגות פחד — בחרו את הרמה שלכם. מדרגה קלילה לילדים ועד דרגת 18+ קיצונית.',
  long_description='מבוך הפחד הוא האטרקציה המקורית של Crazy Mary. המבוך פועל ב-11 דרגות פחד שונות, כך שכל אחד — מילדים ועד חובבי אימה כבדה — יכול לבחור את הרמה שמתאימה לו.
דרגות 1-8: 80₪ לאדם
דרגה 9: 90₪ לאדם
דרגה 10: 100₪ לאדם
דרגה 10+: 110₪ לאדם
דרגה 11 (18+): 130₪ לאדם
סרטון מהמבוך שלכם: 100₪',
  difficulty='1 עד 11',
  duration='כ-15-25 דק׳',
  players='2 ומעלה',
  min_age='מותאם לכל דרגה',
  price='החל מ-80₪',
  hours='',
  order_index=1,
  updated_at=now()
WHERE slug='room-4';

UPDATE public.rooms SET slug='maze-of-fear' WHERE name='מבוך הפחד';

UPDATE public.rooms SET
  price='120₪ לאדם',
  tagline='משחק בריחה חדש · 18+',
  min_age='18+',
  order_index=2,
  updated_at=now()
WHERE slug='the-tomb';

UPDATE public.rooms SET
  price='120₪ לאדם',
  tagline='חדש במתחם',
  order_index=3,
  updated_at=now()
WHERE slug='hide-in-the-dark';

UPDATE public.rooms SET
  price='130₪ לאדם',
  tagline='חדש · חוויית ירי בזומבים',
  order_index=4,
  updated_at=now()
WHERE slug='zombie-shot';
