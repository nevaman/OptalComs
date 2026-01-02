/*
  # Admin Request System

  1. New Tables
    - `admin_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text)
      - `name` (text)
      - `reason` (text) - why they need admin access
      - `status` (text) - pending, approved, denied
      - `reviewed_by` (uuid, references auth.users) - admin who reviewed
      - `reviewed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `admin_requests` table
    - Users can view their own requests
    - Users can create requests for themselves
    - Admins can view and update all requests
*/

CREATE TABLE IF NOT EXISTS admin_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  denial_reason text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE admin_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own admin requests"
  ON admin_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create admin requests"
  ON admin_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all admin requests"
  ON admin_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update admin requests"
  ON admin_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_admin_requests_user_id ON admin_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_requests_status ON admin_requests(status);
