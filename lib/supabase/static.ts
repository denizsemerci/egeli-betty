import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for static generation (no cookies required)
 * Use this for sitemap, generateStaticParams, and other static generation functions
 */
export function createStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase URL and Key are required. Please check your environment variables.')
  }

  return createSupabaseClient(url, key)
}

