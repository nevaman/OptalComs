/*
  # Ensure applications submission_type column exists

  Adds the submission_type column to the applications table if it was created
  before the opportunities migration, preventing missing-column errors.
*/

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS submission_type text NOT NULL DEFAULT 'job';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'applications_submission_type_check'
  ) THEN
    ALTER TABLE applications
      ADD CONSTRAINT applications_submission_type_check
      CHECK (submission_type IN ('job', 'contest', 'grant'));
  END IF;
END $$;
