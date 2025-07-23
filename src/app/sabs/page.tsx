'use client'

import { useEffect } from 'react'

export default function SabsPage() {
  useEffect(() => {
    window.location.href = 'https://sabs.vercel.app'
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirection vers SABS...</p>
    </div>
  )
}