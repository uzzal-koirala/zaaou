-- Relax riders vehicle_type and status check constraints to match admin form options
ALTER TABLE public.riders DROP CONSTRAINT IF EXISTS riders_vehicle_type_check;
ALTER TABLE public.riders
  ADD CONSTRAINT riders_vehicle_type_check
  CHECK (vehicle_type IS NULL OR lower(vehicle_type) = ANY (ARRAY['bike','scooter','bicycle','cycle','car']));

ALTER TABLE public.riders DROP CONSTRAINT IF EXISTS riders_status_check;
ALTER TABLE public.riders
  ADD CONSTRAINT riders_status_check
  CHECK (status = ANY (ARRAY['online','offline','on_delivery','busy','inactive']));