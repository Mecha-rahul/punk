import { useEffect, useState } from 'react'
import { ANNOUNCEMENTS } from '../content/content'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'

// Announcement strip above the main header — auto-rotates, with manual
// prev/next chevrons at the edges (reference-site layout).
export default function AnnouncementBar() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (ANNOUNCEMENTS.length < 2) return
    const t = setInterval(() => setI((v) => (v + 1) % ANNOUNCEMENTS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const prev = () => setI((v) => (v - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)
  const next = () => setI((v) => (v + 1) % ANNOUNCEMENTS.length)

  return (
    <div className="relative bg-ink py-2 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-bg-primary">
      <button
        type="button"
        onClick={prev}
        aria-label="Previous announcement"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-1 transition-opacity hover:opacity-60"
      >
        <ChevronLeftIcon size={14} />
      </button>

      <p key={i} className="animate-[fadein_.4s_ease] px-10">
        {ANNOUNCEMENTS[i]}
      </p>

      <button
        type="button"
        onClick={next}
        aria-label="Next announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-opacity hover:opacity-60"
      >
        <ChevronRightIcon size={14} />
      </button>
    </div>
  )
}
