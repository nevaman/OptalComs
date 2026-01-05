/*
  # Talent Profiles Schema  

  1. New Tables
    - `talent`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `application_id` (uuid, references applications)
      - `name` (text)
      - `role` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `skills` (text[])
      - `portfolio_url` (text)
      - `is_visible` (boolean)
      - `created_at` (timestamptz)

  2. Security 
    - Enable RLS
    - Public can view visible talent
    - Admins can manage all talent
*/

CREATE TABLE IF NOT EXISTS talent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  avatar_url text,
  skills text[] DEFAULT '{}',
  portfolio_url text,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE talent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible talent"
  ON talent FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage all talent"
  ON talent FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE INDEX IF NOT EXISTS idx_talent_user ON talent(user_id);
CREATE INDEX IF NOT EXISTS idx_talent_visible ON talent(is_visible);

