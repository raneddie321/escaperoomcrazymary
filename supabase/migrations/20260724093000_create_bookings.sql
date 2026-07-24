CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_slug text NOT NULL REFERENCES public.rooms(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
  room_name text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  identity_number text NOT NULL,
  email text NOT NULL DEFAULT '',
  players text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  admin_message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_unique_slot UNIQUE (room_slug, booking_date, booking_time)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.bookings TO service_role;

CREATE INDEX IF NOT EXISTS bookings_room_date_idx ON public.bookings (room_slug, booking_date);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON public.bookings (created_at DESC);
