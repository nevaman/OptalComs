import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'editor' | 'viewer';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  year: number;
  industry: string | null;
  disciplines: string[];
  tags: string[];
  summary: string | null;
  services: string[];
  outcomes: string[];
  hero_image: string | null;
  hero_video: string | null;
  thumbnail_image: string | null;
  hover_image: string | null;
  client_name: string | null;
  challenge: string | null;
  insight: string | null;
  solution: string | null;
  results: string | null;
  credits: { name: string; role: string }[];
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type ProjectBlock = {
  id: string;
  project_id: string;
  block_type: 'headline_text' | 'challenge_insight_solution' | 'single_image' | 'image_grid' | 'split_image_text' | 'quote' | 'statistics' | 'process_steps' | 'deliverables' | 'video' | 'gallery' | 'custom_html';
  content: Record<string, unknown>;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Insight = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Record<string, unknown>[];
  featured_image: string | null;
  tags: string[];
  author_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type PageSection = {
  id: string;
  page_name: string;
  section_type: string;
  title: string | null;
  content: Record<string, unknown>;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GlobalSetting = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget_range: string | null;
  project_type: string | null;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
};

export type Media = {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export type AdminRequest = {
  id: string;
  user_id: string;
  email: string;
  name: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  reviewed_by: string | null;
  reviewed_at: string | null;
  denial_reason: string | null;
  created_at: string;
};

export type Opportunity = {
  id: string;
  type: 'job' | 'contest' | 'grant';
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  location: string | null;
  deadline: string | null;
  status: 'open' | 'closed' | 'draft';
  external_link: string | null;
  metadata: Record<string, unknown> | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  opportunity_id: string;
  submission_type: 'job' | 'contest' | 'grant';
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  occupation: string | null;
  experience: string | null;
  portfolio_link: string | null;
  github_link: string | null;
  resume_url: string | null;
  message: string | null;
  how_heard: string | null;
  registration_code: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type Talent = {
  id: string;
  user_id: string | null;
  application_id: string | null;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  skills: string[];
  portfolio_url: string | null;
  is_visible: boolean;
  created_at: string;
};

export type TalentOffering = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  skills: string[];
  tools: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TalentPricingTier = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  price_suffix: string;
  features: string[];
  is_popular: boolean;
  cta_text: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type HiringRequest = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  team_size: string | null;
  budget: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'in_progress' | 'closed' | 'archived';
  notes: string | null;
  created_at: string;
  updated_at: string;
};
