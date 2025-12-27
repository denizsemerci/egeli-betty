'use client'

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'

export default function AuthorBadge() {
  const [authorName, setAuthorName] = useState('Betül')

  useEffect(() => {
    // Get display name from localStorage
    const displayName = localStorage.getItem('admin_displayName')
    setAuthorName(displayName || 'Betül')
  }, [])

  return (
    <div className="flex items-center gap-2 text-text/70 text-sm">
      <User className="w-4 h-4 text-primary" />
      <span>
        <span className="font-medium text-text">{authorName}</span>
        <span className="text-text/50">&apos;nin Mutfağı</span>
      </span>
    </div>
  )
}

