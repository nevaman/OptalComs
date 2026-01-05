-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Careers Table
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    salary_range TEXT,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    is_internal BOOLEAN DEFAULT false,
    external_link TEXT,
    deadline TIMESTAMPTZ,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT false,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contests Table
CREATE TABLE IF NOT EXISTS contests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    brief TEXT NOT NULL,
    prizes JSONB DEFAULT '[]'::jsonb,
    judges JSONB DEFAULT '[]'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    requirements TEXT[] DEFAULT '{}',
    submission_guidelines TEXT[] DEFAULT '{}',
    eligibility TEXT[] DEFAULT '{}',
    sponsors JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL,
    entry_count INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    results_date TIMESTAMPTZ,
    featured_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    external_link TEXT,
    telegram_channel TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grants Table
CREATE TABLE IF NOT EXISTS grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    organization_logo TEXT,
    amount_min INTEGER NOT NULL,
    amount_max INTEGER NOT NULL,
    description TEXT NOT NULL,
    focus_areas TEXT[] DEFAULT '{}',
    eligibility TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    application_process TEXT[] DEFAULT '{}',
    deadline TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL,
    external_link TEXT,
    is_featured BOOLEAN DEFAULT false,
    category TEXT NOT NULL,
    funding_type TEXT NOT NULL,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contest Registrations Table
CREATE TABLE IF NOT EXISTS contest_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    registration_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    occupation TEXT,
    experience TEXT,
    portfolio TEXT,
    how_heard TEXT,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'registered',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contest Winners Table
CREATE TABLE IF NOT EXISTS contest_winners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo TEXT,
    place INTEGER NOT NULL,
    project_title TEXT NOT NULL,
    project_image TEXT,
    testimonial TEXT,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    portfolio_url TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant Applications Table
CREATE TABLE IF NOT EXISTS grant_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grant_id UUID REFERENCES grants(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    organization_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    project_title TEXT NOT NULL,
    project_description TEXT NOT NULL,
    requested_amount INTEGER NOT NULL,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_applications ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public can view careers" ON careers FOR SELECT USING (true);
CREATE POLICY "Public can view contests" ON contests FOR SELECT USING (true);
CREATE POLICY "Public can view grants" ON grants FOR SELECT USING (true);
CREATE POLICY "Public can view contest winners" ON contest_winners FOR SELECT USING (true);

-- Policies for public submissions (assuming public can submit)
CREATE POLICY "Public can register for contests" ON contest_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can apply for jobs" ON job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can apply for grants" ON grant_applications FOR INSERT WITH CHECK (true);

-- Admin policies (assuming role based or simple check for now, adjusting as per existing auth)
-- For now, allowing all operations for authenticated users might be too broad if not all auth users are admins.
-- I'll check if there is an 'admin' role or similar.
-- Based on existing code, there seems to be an admin panel. I'll use a placeholder for admin check or rely on service role for admin tasks if running via MCP, but for the frontend I need proper policies.
-- Let's check 'profiles' table or auth metadata.
-- For now, I'll add policies for authenticated users to have full access if they have admin role, but simply enabling full access for now for simplicity in development environment as per "Full Control: The Admin Panel reads and writes directly".
-- A common pattern is checking a profile role.
-- I'll add a policy that allows everything for users with role 'admin' in profiles table if it exists.
-- Checking profiles table structure from previous tool output: profiles has 'role' column.

CREATE POLICY "Admins can do everything on careers" ON careers FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Admins can do everything on contests" ON contests FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Admins can do everything on grants" ON grants FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Admins can do everything on contest_registrations" ON contest_registrations FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Admins can do everything on contest_winners" ON contest_winners FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Admins can do everything on job_applications" ON job_applications FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Admins can do everything on grant_applications" ON grant_applications FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

