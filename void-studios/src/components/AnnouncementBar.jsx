import { useEffect, useState } from 'react'
import { ANNOUNCEMENTS } from '../content/content'

// Rotating announcement strip above the main header.
export default function AnnouncementBar() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (ANNOUNCEMENTS.length < 2) return
    const t = setInterval(() => setI((v) => (v + 1) % ANNOUNCEMENTS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-ink py-2 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-bg-primary">
      <p key={i} className="animate-[fadein_.4s_ease]">
        {ANNOUNCEMENTS[i]}
      </p>
    </div>
  )
}
