-- Modify contest_registrations table
ALTER TABLE contest_registrations DROP COLUMN IF EXISTS experience;
ALTER TABLE contest_registrations ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE contest_registrations ADD COLUMN IF NOT EXISTS employment_status TEXT;
ALTER TABLE contest_registrations ADD COLUMN IF NOT EXISTS income_level TEXT;

