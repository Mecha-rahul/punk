import { useRef, useState } from 'react'
import { CAMPAIGN_BANNER } from '../content/content'

// Full-bleed video section (GENRAGE-style architecture). Shows the campaign
// banner artwork until a film is cut; drop an mp4 path in `src` when ready.
export default function VideoSection({ src, poster = CAMPAIGN_BANNER, heading }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <section className="bg-bg-primary py-16 sm:py-20">
      <div className="ak-shell">
        {heading && <h2 className="ak-section-title mb-8 text-center">{heading}</h2>}
        <div className="relative aspect-video overflow-hidden bg-bg-secondary">
          {src ? (
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              className="h-full w-full object-cover"
              loop
              muted
              playsInline
              onClick={toggle}
            />
          ) : (
            <>
              {/* campaign banner — the artwork fills the slot until the film exists */}
              <img
                src={poster}
                alt="AKUMA campaign banner"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-4">
                <span className="bg-ink px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-bg-primary">
                  Campaign film coming soon
                </span>
              </div>
            </>
          )}

          {src && !playing && (
            <button
              type="button"
              onClick={toggle}
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors hover:bg-ink/30"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-bg-primary text-bg-primary">
                ▶
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
