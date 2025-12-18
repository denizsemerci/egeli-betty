import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Only create client on client side
  if (typeof window === 'undefined') {
    // Return a placeholder during SSR/build - this should never be called
    return null as any
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase URL and Key are required. Please check your environment variables.')
  }

  return createBrowserClient(url, key)
}

