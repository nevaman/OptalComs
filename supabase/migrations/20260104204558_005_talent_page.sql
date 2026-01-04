/*
  # Talent page content and hiring requests

  ## Overview
  - Adds database tables for public talent offerings and pricing
  - Adds table for inbound hiring requests from the talent page form
  - Seeds initial content to match the existing mock UI
  - Stores hero/stats/process copy in global settings for easy retrieval

  ## Security
  - Public can view active offerings and pricing tiers
  - Anyone can submit hiring requests
  - Admin/editor roles can manage offerings, pricing, and requests
*/

-- Talent offerings displayed on the /talent page
CREATE TABLE IF NOT EXISTS talent_offerings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'palette',
  skills text[] DEFAULT '{}',
  tools text[] DEFAULT '{}',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE talent_offerings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active talent offerings"
  ON talent_offerings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage talent offerings"
  ON talent_offerings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Pricing tiers displayed on the /talent page
CREATE TABLE IF NOT EXISTS talent_pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price integer DEFAULT 0,
  price_suffix text DEFAULT '/month',
  features text[] DEFAULT '{}',
  is_popular boolean DEFAULT false,
  cta_text text DEFAULT 'Get Started',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE talent_pricing_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active pricing tiers"
  ON talent_pricing_tiers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage pricing tiers"
  ON talent_pricing_tiers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Hiring requests submitted from the /talent form
CREATE TABLE IF NOT EXISTS hiring_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  role text,
  team_size text,
  budget text,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed', 'archived')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hiring_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a hiring request"
  ON hiring_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage hiring requests"
  ON hiring_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_talent_offerings_updated_at BEFORE UPDATE ON talent_offerings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_talent_pricing_tiers_updated_at BEFORE UPDATE ON talent_pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hiring_requests_updated_at BEFORE UPDATE ON hiring_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed initial talent offerings
INSERT INTO talent_offerings (title, description, icon, skills, tools, sort_order, is_active)
VALUES
('Graphic Designers', 'Expert visual designers who create stunning brand assets, marketing materials, and digital graphics.', 'palette', ARRAY['Brand Design', 'Print Design', 'Digital Graphics', 'Layout Design'], ARRAY['Figma', 'Photoshop', 'Illustrator', 'InDesign'], 1, true),
('UI/UX Designers', 'User-centered designers who craft intuitive interfaces and seamless digital experiences.', 'pen-tool', ARRAY['User Research', 'Wireframing', 'Prototyping', 'Design Systems'], ARRAY['Figma', 'Sketch', 'Adobe XD', 'Framer'], 2, true),
('Motion Designers', 'Creative animators who bring brands to life through captivating motion graphics and animations.', 'sparkles', ARRAY['2D Animation', '3D Animation', 'Motion Graphics', 'Visual Effects'], ARRAY['After Effects', 'Cinema 4D', 'Blender', 'Premiere Pro'], 3, true),
('Video Editors', 'Skilled editors who transform raw footage into polished, engaging video content.', 'video', ARRAY['Video Editing', 'Color Grading', 'Sound Design', 'Storytelling'], ARRAY['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects'], 4, true),
('Frontend Developers', 'Technical experts who build responsive, performant, and accessible web interfaces.', 'code', ARRAY['React', 'TypeScript', 'CSS/Tailwind', 'Performance'], ARRAY['VS Code', 'Git', 'Figma', 'Chrome DevTools'], 5, true),
('Full Stack Developers', 'Versatile engineers who handle both frontend and backend development with expertise.', 'box', ARRAY['Frontend', 'Backend', 'Databases', 'DevOps'], ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS'], 6, true);

-- Seed initial pricing tiers
INSERT INTO talent_pricing_tiers (name, description, price, price_suffix, features, is_popular, cta_text, sort_order, is_active)
VALUES
('Starter', 'Perfect for small teams getting started with offshore talent.', 2000, '/month', ARRAY[
  'Part-time dedicated talent (20 hrs/week)',
  'Pre-vetted professionals',
  'Basic project management',
  'Weekly check-ins',
  'Email support'
], false, 'Get Started', 1, true),
('Professional', 'Full-time embedded talent for growing teams.', 3500, '/month', ARRAY[
  'Full-time dedicated talent (40 hrs/week)',
  'Top 3% pre-vetted professionals',
  'Dedicated account manager',
  'Performance tracking & reporting',
  'Slack/Teams integration',
  'Priority support'
], true, 'Start Hiring', 2, true),
('Enterprise', 'Custom solutions for scaling organizations.', 0, '', ARRAY[
  'Multiple dedicated team members',
  'Custom vetting requirements',
  'Dedicated success team',
  'Custom integrations',
  'SLA guarantees',
  'Quarterly business reviews',
  'Volume discounts'
], false, 'Contact Sales', 3, true);

-- Store hero/stats/process copy in global settings for easy retrieval
INSERT INTO global_settings (key, value)
VALUES (
  'talent_page_content',
  jsonb_build_object(
    'hero', jsonb_build_object(
      'badge_text', 'Trusted by 50+ growing companies',
      'headline', 'Easiest way to hire',
      'headline_accent', 'elite creative talent.',
      'subheadline', 'Optal helps growing companies hire top 3% designers and developers that are rigorously vetted and managed end-to-end to be the ready-to-use resource your team needs.',
      'cta_primary', 'Start Hiring',
      'cta_secondary', 'See How It Works'
    ),
    'stats', jsonb_build_array(
      jsonb_build_object('id', '1', 'value', '3%', 'label', 'Acceptance rate for Optal talent', 'sort_order', 1),
      jsonb_build_object('id', '2', 'value', '70%', 'label', 'Average savings on salaries', 'sort_order', 2),
      jsonb_build_object('id', '3', 'value', '14d', 'label', 'Avg time to placement', 'sort_order', 3)
    ),
    'vetting_steps', jsonb_build_array(
      jsonb_build_object('id', '1', 'stage', 'Initial Screening', 'percentage', 40, 'description', 'Portfolio & experience review', 'sort_order', 1),
      jsonb_build_object('id', '2', 'stage', 'Soft Skills & English', 'percentage', 18, 'description', 'Communication assessment', 'sort_order', 2),
      jsonb_build_object('id', '3', 'stage', 'Technical Interviews', 'percentage', 10, 'description', 'Domain expertise evaluation', 'sort_order', 3),
      jsonb_build_object('id', '4', 'stage', 'Real-world Projects', 'percentage', 5, 'description', 'Practical skill demonstration', 'sort_order', 4),
      jsonb_build_object('id', '5', 'stage', 'Final Interviews', 'percentage', 3, 'description', 'Culture & fit assessment', 'sort_order', 5)
    ),
    'process_steps', jsonb_build_array(
      jsonb_build_object('id', '1', 'number', '01', 'title', 'Discovery Call', 'description', 'We work to understand your hiring goals and identify where your team needs the most support. Together we outline a plan for embedded talent, placement timeline, and your needs for a perfect fit.', 'sort_order', 1),
      jsonb_build_object('id', '2', 'number', '02', 'title', 'Training & Selection', 'description', 'Optal selects and shares the perfect fit from our pool of pre-vetted candidates. We then begin their training process to ensure they are ready to embed with your team seamlessly.', 'sort_order', 2),
      jsonb_build_object('id', '3', 'number', '03', 'title', 'Kickoff & Placement', 'description', 'We introduce you to your talent, ensure everyone is set up for success, and kick off the engagement. Your Account Manager will check in frequently during the first 60 days.', 'sort_order', 3)
    )
  )
) ON CONFLICT (key) DO NOTHING;