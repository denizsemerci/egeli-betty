/**
 * Admin helper functions
 */

/**
 * Get the display name for the author
 * If displayName is set in localStorage, use it; otherwise use default username
 */
export function getAuthorDisplayName(): string {
  if (typeof window === 'undefined') {
    return 'Betül' // Server-side default
  }

  const displayName = localStorage.getItem('admin_displayName')
  return displayName || 'Betül'
}

/**
 * Get author display name for server-side rendering
 * This reads from a cookie or uses a default
 */
export function getAuthorDisplayNameServer(): string {
  // For server-side, we'll use a default
  // In a real app, this would read from database or cookies
  return 'Betül'
}

