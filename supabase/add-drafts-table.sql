-- Migration: Add drafts table for saving recipe drafts
-- Date: 2024
-- Description: Creates a separate table for recipe drafts

-- Create drafts table
CREATE TABLE IF NOT EXISTS drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  category TEXT,
  prep_time INTEGER,
  servings INTEGER,
  ingredients JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  images TEXT[],
  image_url TEXT,
  current_step INTEGER DEFAULT 1,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_drafts_user_email ON drafts(user_email);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON drafts(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read drafts (public access for now, can be restricted later)
CREATE POLICY "Drafts are viewable by everyone"
  ON public.drafts FOR SELECT
  USING (true);

-- Policy: Anyone can insert drafts
CREATE POLICY "Anyone can insert drafts"
  ON public.drafts FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update drafts
CREATE POLICY "Anyone can update drafts"
  ON public.drafts FOR UPDATE
  USING (true);

-- Policy: Anyone can delete drafts
CREATE POLICY "Anyone can delete drafts"
  ON public.drafts FOR DELETE
  USING (true);

-- Add comment to table
COMMENT ON TABLE drafts IS 'Table for storing recipe drafts before they are published as recipes.';

