/*
  # Opportunities and Applications

  Adds persistence for opportunities (jobs, contests, grants) and user submissions.
  This powers the admin Opportunities CRUD screens and the public Opportunities page.
*/

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('job', 'contest', 'grant')),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  location text,
  deadline timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('open', 'closed', 'draft')),
  external_link text,
  metadata jsonb NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_slug ON opportunities(slug);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published opportunities"
  ON opportunities FOR SELECT
  USING (status != 'draft');

CREATE POLICY "Admins can manage opportunities"
  ON opportunities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Applications table (jobs, contests, grants)
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  submission_type text NOT NULL DEFAULT 'job' CHECK (submission_type IN ('job', 'contest', 'grant')),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  occupation text,
  experience text,
  portfolio_link text,
  github_link text,
  resume_url text,
  message text,
  how_heard text,
  registration_code text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(submission_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications"
  ON applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM opportunities
      WHERE opportunities.id = applications.opportunity_id
      AND opportunities.status != 'draft'
    )
  );

CREATE POLICY "Admins can view applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );
